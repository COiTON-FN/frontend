import * as React from "react";
import { MdVerified } from "react-icons/md";

import { cn, generateAvatarFromAddress, truncateAddr } from "@/lib/utils";
import { User } from "@/store/slice/credential.slice";
import { ClipboardCopy } from "./clipboard-copy";

interface UserAvatarProps {
  user: User;
  parentClass?: string;
  avatarClass?: string;
  nameClass?: string;
  addrClass?: string;
  copyAddr?: boolean;
  copySize?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  parentClass,
  avatarClass,
  nameClass,
  addrClass,
  copyAddr = false,
  copySize = 16,
}) => {
  return (
    <div className={cn("flex items-center gap-4", parentClass)}>
      <div
        className={cn(
          "size-11 rounded-full bg-gradient-to-br from-primary via-teal-500 to-teal-300 p-[2px]",
          avatarClass,
        )}
      >
        <div className="size-full rounded-full bg-background p-[2px]">
          <img
            src={generateAvatarFromAddress(user.address)}
            alt={user.address}
            className="size-full rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="flex items-center gap-1.5">
          <span className={cn("", nameClass)}>{user.details.name}</span>
          {user?.verified && (
            <MdVerified
              style={{ width: `${copySize}px`, height: `${copySize}px` }}
              className="mt-px text-primary"
            />
          )}
        </p>
        <p className={cn("flex items-center gap-2 text-xs", addrClass)}>
          {copyAddr ? (
            <ClipboardCopy value={user.address} size={copySize}>
              <span className="text-foreground/60">
                {truncateAddr(user.address)}
              </span>
            </ClipboardCopy>
          ) : (
            <span className="text-foreground/60">
              {truncateAddr(user.address)}
            </span>
          )}
          -
          <span className="font-medium text-primary dark:text-green-600">
            {user.user_type}
          </span>
        </p>
      </div>
    </div>
  );
};
