import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/store/slice/credential.slice";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { RootState, useAppSelector } from "@/store";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RxOpenInNewWindow } from "react-icons/rx";
import { Phone } from "lucide-react";
import { SEO } from "@/components/shared/seo";
import { contract } from "@/utils/contract";
import { stringToByteArray } from "@/lib/starknet/utils";
import { BigNumberish, ec, hash } from "starknet";
import { useContractInstance } from "@/hooks/useContractInstance.hook";
import { SearchInput } from "@/components/shared/search-input";
import { useSearchFilter } from "@/hooks/useSearchFilter.hook";
import { UserAvatar } from "@/components/shared/user-avatar";

function UserCard({ user }: { user: User }) {
  const isVerified = user.verified;

  return (
    <div className="group relative rounded-[18px] border bg-background shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <div className="border-b p-4">
        <Link to={`/profile?address=${user?.address}`}>
          <UserAvatar
            user={user}
            parentClass="gap-3"
            avatarClass="size-12"
            nameClass="text-base line-clamp-1 font-medium text-foreground group-hover:text-primary transition-colors"
            addrClass="text-sm font-medium"
          />
        </Link>
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="size-4" />
          <p className="text-sm font-medium">
            {user?.details?.phone?.national}
          </p>
        </div>

        {!isVerified && (
          <VerifyUserModal user={user}>
            <Button
              size={"sm"}
              variant={"link"}
              className="flex h-0 items-center gap-1 p-0 text-primary"
            >
              <p className="text-sm font-medium">Verify Agent</p>
              <IoChevronForwardOutline className="size-4" />
            </Button>
          </VerifyUserModal>
        )}
      </div>
    </div>
  );
}

const verificationSchema = z.object({
  key: z.string().min(10, {
    message: "Private key must be at least 10 characters.",
  }),
});

function VerifyUserModal({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const { getContractInstance } = useContractInstance();

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      key: "",
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  async function onSubmit(values: z.infer<typeof verificationSchema>) {
    // await new Promise((r) => setTimeout(r, 1000));
    // toast.success("Account verified successfully");

    const contractInstance = getContractInstance();

    const data = {
      signer: "",
      payload: {
        entryPoint: "verify_user",
        contractAddress: contract.daoAddress as string,
        calldata: [user.address],
      },
    };

    const call = contractInstance!.populate(
      data.payload.entryPoint,
      data.payload.calldata,
    );

    const message: BigNumberish[] = stringToByteArray(
      JSON.stringify(data.payload),
    ).split(",");

    const msgHash = hash.computeHashOnElements(message);
    const signature = ec.starkCurve.sign(msgHash, values.key);
    const signer = ec.starkCurve.getStarkKey(values.key);

    console.log({ call, msgHash, signature, signer });

    const account = window.Wallet.Account;

    const result = await account?.execute(call);

    console.log(result);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md !rounded-2xl">
        <DialogHeader>
          <DialogTitle>Account Verification</DialogTitle>
          <DialogDescription>
            Please verify ownership of the account below by entering your
            private key.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl bg-secondary p-4 dark:bg-neutral-900">
          <div className="mb-4 border-b pb-4">
            <UserAvatar
              copyAddr
              user={user}
              copySize={14}
              parentClass="gap-3"
              avatarClass="size-12"
              nameClass="text-base line-clamp-1 font-medium text-foreground group-hover:text-primary transition-colors"
              addrClass="text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-6">
              <p className="text-sm">Email:</p>
              <p className="text-sm font-medium text-primary">
                {user?.details?.email}
              </p>
            </div>
            <div className="flex items-start justify-between gap-6">
              <p className="text-sm">Country:</p>
              <p className="text-sm font-medium text-primary">
                {user?.details?.region?.country
                  ? user?.details?.region?.country?.countryName
                  : user?.details?.region[0]}
              </p>
            </div>
            <div className="flex items-start justify-between gap-6">
              <p className="text-sm">Phone:</p>
              <p className="text-sm font-medium text-primary">
                {user?.details?.phone?.national}
              </p>
            </div>
          </div>

          {user?.details?.licenseCid && (
            <div className="mt-4 flex items-start justify-between gap-6 border-t pt-4">
              <p className="text-sm">License(s)</p>

              <div className="flex items-center gap-4">
                {user?.details?.licenseCid.map(
                  (license: string, index: number) => (
                    <Link
                      target="_blank"
                      key={license ?? index}
                      className="flex size-12 items-center justify-center rounded-xl border bg-background"
                      to={`${import.meta.env.VITE_PINATA_GATEWAY}/${license}?pinataGatewayToken=${import.meta.env.VITE_PINATA_GATEWAY_TOKEN}`}
                    >
                      <RxOpenInNewWindow
                        className="size-5 text-primary"
                        role="button"
                      />
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="password"
                      placeholder="Enter your private key"
                      error={!!errors.key}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used for verification only and will not be
                    stored.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={isSubmitting}
                  type="button"
                  variant={"outline"}
                  className="px-6"
                >
                  <span className="text-sm">Cancel</span>
                </Button>
              </DialogClose>
              <Button
                isLoading={isSubmitting}
                txt="Verifying..."
                type="submit"
                className="flex-1"
              >
                <span className="text-sm">Verify Ownership</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const filterTypes = [
  { label: "All Users", value: "default" },
  { label: "– Entities –", value: "entity" },
  { label: "– Individuals –", value: "individual" },
  { label: "– Verified Accounts –", value: "verified" },
];

export default function UsersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const init = (key: string, def: string) => searchParams.get(key) ?? def;

  const [typeFilter, setTypeFilter] = useState(init("type", "default"));

  const users = useAppSelector((state: RootState) => state.users.users);
  const contractOwner = useAppSelector(
    (state: RootState) => state.wallet.contractOwner,
  );
  const credential = useAppSelector(
    (state: RootState) => state.credential.credential,
  );

  const isContractOwner =
    String(credential?.address).toLowerCase() ===
    String(contractOwner).toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (typeFilter === "entity") return user.user_type === "Entity";
    if (typeFilter === "individual") return user.user_type === "Individual";
    if (typeFilter === "verified") return user.verified;
    return true;
  });

  const { search, setSearch, filtered } = useSearchFilter(
    filteredUsers,
    [(l) => l.address, (l) => l?.details?.name],
    init("search", ""),
  );

  useEffect(() => {
    const params: Record<string, string> = {};
    if (typeFilter !== "default") params.tag = typeFilter;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [typeFilter, search, setSearchParams]);

  useEffect(() => {
    if (!isContractOwner) navigate("/dashboard", { replace: true });
  }, [isContractOwner, navigate]);

  return (
    <Fragment>
      <SEO title="Accounts" />

      <div className="py-6">
        <div className="flex flex-col gap-8 overflow-clip rounded-2xl py-6 md:rounded-3xl md:border md:bg-background md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder={`Search ${
                typeFilter === "default" ? "users" : typeFilter
              } by name or address...`}
              className="w-full lg:max-w-md"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="!h-14 w-full !rounded-full !text-sm md:max-w-[200px]">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filterTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-sm"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {users.length === 0 ? (
              Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-24 w-full rounded-xl p-4 sm:bg-background"
                />
              ))
            ) : filtered.length > 0 ? (
              filtered.map((user, index) => (
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 100 },
                    animate: (index: number) => ({
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.03 * (index ?? 1),
                        duration: 0.9,
                        type: "spring",
                      },
                    }),
                  }}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  key={user.id ?? index}
                >
                  <UserCard key={user.id ?? index} user={user} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-base">
                No users match the filter.
              </p>
            )}
          </section>
        </div>
      </div>
    </Fragment>
  );
}
