import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";
import {
  copyToClipboard,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/store/slice/credential.slice";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoChevronForwardOutline, IoCopyOutline } from "react-icons/io5";
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
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { Phone } from "lucide-react";

function UserCard({ user }: { user: User }) {
  const isVerified = user.verified;

  return (
    <div className="group relative rounded-[18px] border bg-background shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <div className="flex items-start gap-3 border-b p-4">
        <Link
          to={`/profile?address=${user?.address}`}
          className="size-14 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px]"
        >
          <div className="size-full rounded-full bg-background p-[2.5px]">
            <img
              src={generateAvatarFromAddress(user?.address)}
              alt={user?.details.name}
              width={64}
              height={64}
              className="size-full rounded-full object-contain"
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <Link
            to={`/profile?address=${user?.address}`}
            className="flex items-center gap-2"
          >
            <p className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
              {user.details.name}
            </p>
            {isVerified && <MdVerified className="mt-px size-4 text-primary" />}
          </Link>
          <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            {truncateAddr(user.address)}{" "}
            <span
              className="cursor-pointer"
              onClick={() => {
                copyToClipboard(user.address);
              }}
            >
              <IoCopyOutline className="!size-3.5" />
            </span>
          </p>
        </div>

        <p className="text-sm font-medium text-primary">{user.user_type}</p>
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
    await new Promise((r) => setTimeout(r, 1000));
    console.log(values);
    toast.success("Account verified successfully");
  }

  // const dt = {
  //   signature: "address", // <call-signature>
  //   payload: {
  //     entryPoint: "verify", // <function-name>,
  //     contractAddress: "0x1111", //<contract-address>,
  //     calldata: [], // <array of arguments>
  //   },
  // };

  // const message = stringToByteArray({JSON.stringify(<payload>)});
  //   const msgHash = hash.computeHashOnElements(message);
  //   const signature = ec.starkCurve.sign(msgHash, PRIVATE_KEY);

  // const message = stringToByteArray({JSON.stringify(<payload>)}).split(",");
  //   const msgHash = hash.computeHashOnElements(message);
  //   const signature = ec.starkCurve.sign(msgHash, PRIVATE_KEY);

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

        <div className="rounded-xl bg-secondary p-4">
          <div className="mb-4 flex items-start gap-3 border-b pb-4">
            <div className="size-14 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2.5px]">
              <div className="size-full rounded-full bg-background p-[2.5px]">
                <img
                  src={generateAvatarFromAddress(user?.address)}
                  alt={user?.details.name}
                  width={64}
                  height={64}
                  className="size-full rounded-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
                  {user.details.name}
                </p>
                {user?.verified && (
                  <MdVerified className="mt-px size-4 text-primary" />
                )}
              </div>
              <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                {truncateAddr(user.address)}{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    copyToClipboard(user.address);
                  }}
                >
                  <IoCopyOutline className="!size-3.5" />
                </span>
              </p>
            </div>

            <p className="text-sm font-medium text-primary">{user.user_type}</p>
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
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
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
  { label: "Default", value: "all" },
  { label: "Entities", value: "entity" },
  { label: "Individuals", value: "individual" },
  { label: "Verified Accounts", value: "verified" },
];

export default function UsersPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
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

  const filteredUsers = users
    .filter((user) => {
      if (filter === "entity") return user.user_type === "Entity";
      if (filter === "individual") return user.user_type === "Individual";
      if (filter === "verified") return user.verified;
      return true;
    })
    .filter(
      (user) =>
        user.details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  useEffect(() => {
    if (!isContractOwner) navigate("/dashboard", { replace: true });
  }, [isContractOwner, navigate]);

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${
              filter === "all" ? "users" : filter
            } by name or address...`}
            className="px-5"
          />
        </div>
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="!h-12 w-full !text-sm sm:w-[200px]">
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

      <section className="overflow-clip">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {users.length === 0 ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full rounded-xl p-4 sm:bg-background"
              />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 100 },
                  animate: (index: number) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.05 * index,
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
        </div>
      </section>
    </div>
  );
}
