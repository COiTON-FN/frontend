import ProfileCard from "@/components/shared/profile-card";
import { Separator } from "@/components/ui/separator";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { User } from "@/store/slice/credential.slice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BID from "../../../assets/images/bid.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiLeaf } from "react-icons/bi";
import { Listing } from "@/store/slice/listing.slice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { variables } from "@/utils/variables";
import { useAppSelector } from "@/store";

export default function BidPage() {
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("requestId");
  const listingId = searchParams.get("listingId");

  const [initiator, setInitiator] = useState<User | null>(null);
  const [listingDetails, setListingDetails] = useState<{
    banner: string,
    snapshot: string,
    type: string,
    zip: number,
    bidPrice: number,
    price: number,
    state: string,
    country: string,
  } | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { walletAddress } = useAppSelector(state => state.wallet)

  const { getContractInstance, getErc721Instance,getErc20Instance } = useContractInstance()

  useEffect(() => {
    (async () => {
      try {
        if (!requestId || !listingId) return;

        const contract = getContractInstance();
        if (!contract) return;

        const listing = await contract.get_listing(Number(listingId));

        const purchaseRequest = await contract.get_purchase(listingId, requestId);
        const refinedPurchaseRequest = {
          listingId,
          requestId,
          price: Number(purchaseRequest?.price),
          initiator: BigInt(purchaseRequest?.initiator).toString(16),
        }

        const initiatorDetails = await contract.get_user(`0x${refinedPurchaseRequest?.initiator}`);
        const initiator: User = {
          ...initiatorDetails,
          address: BigInt(initiatorDetails?.address).toString(16),
          id: Number(initiatorDetails?.id),
          details: byteArrayToString(initiatorDetails?.details),
          user_type: initiatorDetails?.user_type.variant.Entity ? "Entity" : "Individual"
        }

        setInitiator(initiator)

        const structured: Listing = {
          id: Number(listing.id),
          owner: BigInt(listing.owner).toString(16),
          price: Number(listing.price),
          tag: listing.tag.variant.Sold ? "Sold" : "ForSale",
          details: byteArrayToString(listing.details),
          owner_details: undefined
        };


        const snapshotDetails = {
          banner: structured?.details?.imagesCid[0],
          snapshot: structured?.details?.description,
          type: structured?.details?.structureType,
          zip: Number(structured?.details?.zip),
          bidPrice: Number(refinedPurchaseRequest?.price),
          price: Number(structured?.details?.price),
          state: structured?.details?.region?.state?.stateName,
          country: structured?.details?.region?.country?.countryName,
        }

        setListingDetails(snapshotDetails)

      } catch (error) {
        console.error("Failed to load requests:", error);
      }
    })();
  }, [getContractInstance, listingId, requestId]);

  const handleApprovePurchaseRequest = async () => {
    if (!requestId || !listingId || !listingDetails || !initiator) return;

    const { bidPrice, price } = listingDetails;

    try {
      const contract = getContractInstance();
      if (!contract) return;
      setIsApproving(true);

      const erc20 = getErc20Instance();
      const allowance = await erc20!.allowance(`0x${initiator?.address}`, variables.daoAddress);
      const account = window.Wallet.Account!;
      if ((bidPrice || price) > Number(allowance)) {
        const approval_call = erc20!.populate("approve", [
          variables.daoAddress,
          bidPrice || price
        ]);

        console.log(approval_call);

        const approval_tx = await account.execute(approval_call);
        await account.waitForTransaction(approval_tx.transaction_hash);
      }

      const erc721 = getErc721Instance();
      const approvedAddress = await erc721!.get_approved(listingId);

      console.log({ approvedAddress });

      if (approvedAddress !== walletAddress) {
        const approval_call = erc721!.populate("approve", [
          variables.erc721Address,
          listingId
        ]);

        const approval_tx = await window.Wallet.Account!.execute(approval_call);
        await window.Wallet.Account!.waitForTransaction(approval_tx.transaction_hash);
      }

      const call = contract.populate("approve_purchase_request", [listingId, requestId]);
      const tx = await window.Wallet.Account!.execute(call);
      const receipt = await window.Wallet.Account!.waitForTransaction(tx.transaction_hash);
      setIsApproving(false);

      console.log(receipt)
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setIsApproving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <ProfileCard credentialStore={initiator} />

          <div className="flex w-full flex-col gap-6 xl:w-[60%] rounded-2xl border bg-background py-6 sm:p-6 md:gap-10 md:p-10">
            <div className="aspect-[1.4] w-full overflow-hidden rounded-2xl border bg-secondary lg:aspect-[1.3]">
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}/${listingDetails?.banner}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                alt={`${listingDetails?.banner}`}
                className="size-full object-cover"
              />
            </div>


            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-primary">Snapshot</p>
              <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-lg">
                <span
                  className={cn("md:font-normal", {
                    "line-clamp-4": !showMore,
                  })}
                >
                  {listingDetails?.snapshot}
                </span>
                <span
                  role="button"
                  onClick={() => setShowMore(!showMore)}
                  className="w-max font-medium text-primary"
                >
                  {showMore ? "View Less" : "View More"}
                </span>
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <p className="mb-2 border-b pb-2 text-base font-semibold uppercase tracking-wide">
                Building Info
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Type
                  </span>
                  <span className="text font-medium">{listingDetails?.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Bid Price
                  </span>
                  <span className="text font-medium">${listingDetails?.bidPrice.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    ZIP
                  </span>
                  <span className="text font-medium">{listingDetails?.zip}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Price
                  </span>
                  <span className="text font-medium">${listingDetails?.price.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    State/County
                  </span>
                  <span className="text font-medium">{listingDetails?.state}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">
                    Country
                  </span>
                  <span className="text font-medium">{listingDetails?.country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 items-start">
          <div className="space-y-7 h-max">
            <img src={BID} alt="" />
          </div>

          <div className="flex flex-col gap-10">
            <div className="">
              <label htmlFor="bid" className="text-sm text-muted-foreground">Bid Offer</label>
              <Input type="number" disabled id="bid" className="mt-1 text-sm" placeholder={`$${listingDetails?.bidPrice.toLocaleString()}`} />
              <p className="text-base text-muted-foreground">This is current bid offer from this user, you can either approve ot disapprove if this offer aligns with you.</p>
            </div>

            <div className="flex items-center gap-4">
              <Button isLoading={isApproving} content="Approving..." className="w-[220px]" size="lg" onClick={handleApprovePurchaseRequest}>
                <BiLeaf className="size-5" />
                <span>Approve</span>
              </Button>
              <Button variant={"destructive"} disabled className="w-[220px]" size="lg">
                <BiLeaf className="size-5" />
                <span>Disapprove</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
