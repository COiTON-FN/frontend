import * as React from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import type { IconType } from "react-icons/lib";
import { FaLinkedinIn } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { SiWhatsapp } from "react-icons/si";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClipboardCopy } from "./clipboard-copy";

type SharePlatform =
  | "facebook"
  | "linkedin"
  | "twitter"
  | "whatsapp"
  | "telegram";
type ShareTo = SharePlatform[];

interface SharePopupProps {
  children: React.ReactNode;
  shareUrl: string;
  title?: string;
  platforms: ShareTo;
}

const shareConfig: {
  [key in SharePlatform]: {
    Button: React.ElementType;
    label: string;
    icon: IconType;
  };
} = {
  facebook: {
    Button: FacebookShareButton,
    label: "Facebook",
    icon: FaFacebookF,
  },
  linkedin: {
    Button: LinkedinShareButton,
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  twitter: {
    Button: TwitterShareButton,
    label: "Twitter",
    icon: FaXTwitter,
  },
  whatsapp: {
    Button: WhatsappShareButton,
    label: "WhatsApp",
    icon: SiWhatsapp,
  },
  telegram: {
    Button: TelegramShareButton,
    label: "Telegram",
    icon: LiaTelegramPlane,
  },
};

export const SharePopup: React.FC<SharePopupProps> = ({
  children,
  shareUrl,
  platforms,
  title,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="flex flex-col gap-4 rounded-3xl p-6 sm:gap-6"
      >
        <div className="mx-auto flex items-center gap-4 sm:gap-5">
          {platforms.map((platform) => {
            const { Button, label, icon: Icon } = shareConfig[platform];

            return (
              <Button key={platform} url={shareUrl}>
                <div className="flex flex-col gap-1 text-center sm:gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full border sm:size-12">
                    <Icon className="size-5" />
                  </div>
                  <p className="whitespace-nowrap text-[10px] sm:text-xs">
                    {label}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="flex h-12 w-full items-center rounded-lg bg-secondary px-4 py-1 dark:bg-neutral-900">
          <ClipboardCopy
            value={shareUrl}
            className="flex w-full !flex-row !justify-between gap-4"
          >
            <p className="max-w-[230px] truncate text-xs sm:text-sm">{title}</p>
          </ClipboardCopy>
        </div>
      </PopoverContent>
    </Popover>
  );
};
