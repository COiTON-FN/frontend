import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { HiOutlineLink } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { X } from "lucide-react";
import { SOCIAL } from "./social-input";

interface SocialInputFieldProps {
  social: SOCIAL;
  onChange: (url: string) => void;
  onRemove: () => void;
  error?: boolean;
}

const SocialInputField = ({
  social,
  onChange,
  onRemove,
  error,
}: SocialInputFieldProps) => {
  const IconComponent = (() => {
    switch (social.type) {
      case "twitter":
        return FaXTwitter;
      case "instagram":
        return FaInstagram;
      case "telegram":
        return PiTelegramLogoDuotone;
      case "linkedin":
        return FaLinkedin;
      case "facebook":
        return FaFacebookF;
      default:
        return HiOutlineLink;
    }
  })();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          value={social.url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter social media URL"
          className={cn("pl-11", error && "border-destructive")}
        />
        <IconComponent className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <Button
        type="button"
        variant={"outline"}
        size="icon"
        onClick={onRemove}
        className="rounded-md"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
};

export default memo(SocialInputField);
