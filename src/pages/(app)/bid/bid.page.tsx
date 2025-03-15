import ProfileCard from "@/components/shared/profile-card";
import { Separator } from "@/components/ui/separator";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { byteArrayToString } from "@/lib/starknet/utils";
import { RootState, useAppSelector } from "@/store";
import { User } from "@/store/slice/credential.slice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import BID from "../../../assets/images/bid.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiLeaf } from "react-icons/bi";

export default function BidPage() {
    const location = useLocation();
    // const navigate = useNavigate();
    const { address } = useParams();
    // const [searchParams] = useSearchParams();
    // const propsery = searchParams.get('propsery');

    const { getContractInstance, getRPCProviderContract } = useContractInstance()

    const connectedAddress = useAppSelector(state => state.wallet.walletAddress);
    const credential = useSelector((state: RootState) => state.credential.credential);


    const [credentialStore, setCredential] = useState<User | null>(null);
    const [_, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const state = location?.state;
        if (state) {
            setCredential(state);
        } else {
            (async function () {
                try {
                    if (address?.toLowerCase() === connectedAddress) {
                        setCredential(credential);
                        return;
                    }
                    const contract = window.Wallet?.IsConnected ? getContractInstance() : getRPCProviderContract();
                    if (!contract) return;
                    setLoading(true);
                    const user = await contract.get_user(address);

                    const user_construct: User = {
                        ...user,
                        address: BigInt(user.address).toString(16),
                        id: Number(user.id),
                        details: byteArrayToString(user.details),
                        user_type: user.user_type.variant.Entity ? "Entity" : "Individual",
                    }

                    setCredential(user_construct);
                    setLoading(false)
                } catch (error) {
                    console.log("error", error)
                    setLoading(false)
                }
            }())
        }
    }, [address, connectedAddress, credential, getContractInstance, getRPCProviderContract, location?.state])

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex w-full flex-col gap-4 sm:gap-6 md:gap-10">
                <div className="flex w-full flex-col gap-6 xl:flex-row">
                    <ProfileCard credentialStore={credentialStore} />

                    <div className="flex w-full flex-col gap-6 xl:w-[60%] rounded-2xl border bg-background py-6 sm:p-6 md:gap-10 md:p-10">
                         <div className="aspect-video w-full overflow-hidden rounded-2xl bg-secondary"></div>


                        <div className="flex flex-col gap-2">
                        <p className="text-xl font-bold text-primary">Snapshot</p>
                        <pre className="flex flex-col whitespace-pre-wrap text-left font-satoshi text-base md:text-base">
                            <span
                            className={"line-clamp-4 md:font-normal"}
                            >
                            Experience the perfect blend of luxury and comfort in this stunning 4-bedroom duplex. Featuring spacious interiors, a modern kitchen with high-end appliances, and elegantly designed living areas, this home is ideal for families or professionals. Enjoy a private balcony, ample parking, and a gated compound in a serene neighborhood. With top-tier amenities such as 24/7 electricity, high-speed internet, and smart home features, this property offers convenience and sophistication in one package.
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
                                House Info
                                </span>
                                <span className="text font-medium">3 bedroom duplex, Lekki</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                Current Bid Price
                                </span>
                                <span className="text font-medium">$28,000</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                ZIP
                                </span>
                                <span className="text font-medium">089123</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                Previous Bid Info
                                </span>
                                <span className="text font-medium">$22,000</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                State/County
                                </span>
                                <span className="text font-medium">Lagos State</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground">
                                Country
                                </span>
                                <span className="text font-medium">Nigeria</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-2 h-px w-full" />

                <div className="grid xl:grid-cols-2 grid-cols-1 lg:gap-0 gap-10 items-start">
                    <div className="space-y-7 h-max">
                        <img src={BID} alt="" />
                    </div>

                    <div className="flex flex-col gap-10">
                         <div className="">
                            <label htmlFor="bid" className="text-sm text-muted-foreground">Bid Offer</label>
                            <Input type="number" id="bid" className="mt-1 text-sm" placeholder="$28,000" />
                            <p className="text-base text-muted-foreground">This is current bid offer from this user, you can either approve ot disapprove if this offer aligns with you.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button className="w-[220px]" size="lg">
                                <BiLeaf className="size-5" />
                                <span>Approve</span>
                            </Button>
                            <Button variant={"destructive"} className="w-[220px]" size="lg">
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
