import { MdVerified } from "react-icons/md";
import {
  copyToClipboard,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { User } from "@/store/slice/credential.slice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { RootState, useAppSelector } from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

function UserCard({ user }: { user: User }) {
  const isVerified = user.verified;

  return (
    <div className="group relative flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-4 shadow transition-shadow">
      <div className="flex items-center gap-4">
        <div className="size-16 shrink-0 overflow-hidden rounded-[12px] border p-0.5">
          <div className="size-full rounded-[10px] border bg-secondary">
            <img
              src={generateAvatarFromAddress(user?.address)}
              alt={user?.details.name}
              width={56}
              height={56}
              className="size-full rounded-[8px] object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-foreground transition-colors group-hover:text-primary">
              {user.details.name}
            </p>
            {isVerified && <MdVerified className="mt-px size-4 text-primary" />}
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
          <p className="mt-1 text-xs font-medium text-primary">
            {user.user_type}
          </p>
        </div>
      </div>

      {!isVerified && (
        <Button
          variant={"outline"}
          className="mt-auto !h-auto rounded-md border-primary px-3 py-1 text-xs text-primary"
        >
          Verify
        </Button>
      )}
    </div>
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
    <div className="flex flex-col gap-8 py-4">
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

      <section>
        <header className="mb-4 text-lg font-semibold capitalize text-primary">
          {filter === "all" ? "All Users" : `${filter} users`}
        </header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {users.length === 0 ? (
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full rounded-xl p-4 sm:bg-background"
              />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
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
