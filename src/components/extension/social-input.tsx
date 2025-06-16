import { detectSocialType } from "@/lib/utils";
import SocialInputField from "./social-input-field";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import React from "react";

export type SOCIAL_TYPES =
  | "twitter"
  | "instagram"
  | "telegram"
  | "linkedin"
  | "facebook"
  | "other";

export interface SOCIAL {
  id: string;
  url: string;
  type: SOCIAL_TYPES;
}

export interface SOCIAL_INPUT_PROPS {
  value: SOCIAL[];
  onChange: (value: SOCIAL[]) => void;
  error?: string;
  maxSocials?: number;
  disable?: boolean;
}

const SocialInput = React.forwardRef<HTMLDivElement, SOCIAL_INPUT_PROPS>(
  ({ value, onChange = () => {}, disable, error, maxSocials = 6 }, ref) => {
    const handleAddSocial = () => {
      if (value?.length >= maxSocials) return;

      const newSocial: SOCIAL = {
        id: crypto.randomUUID(),
        url: "",
        type: "other",
      };
      onChange([...(value || []), newSocial]);
    };

    const handleRemoveSocial = (id: string) => {
      onChange((value || []).filter((social) => social.id !== id));
    };

    const handleUrlChange = (id: string, url: string) => {
      onChange(
        (value || []).map((social) => {
          if (social.id === id) {
            return { ...social, url, type: detectSocialType(url) };
          }
          return social;
        }),
      );
    };

    const hasEmptyFields = value?.some(
      (social) => !social.url || social.url.trim() === "",
    );

    return (
      <FormItem ref={ref}>
        <FormControl>
          <div className="flex flex-col gap-2">
            {value?.length !== maxSocials && (
              <Badge
                role="button"
                variant="outline"
                onClick={handleAddSocial}
                className="ml-auto rounded-md font-normal"
              >
                Add Social Link
              </Badge>
            )}
            {(value || []).map((social) => (
              <SocialInputField
                key={social.id}
                social={social}
                onChange={(url) => handleUrlChange(social.id, url)}
                onRemove={() => handleRemoveSocial(social.id)}
                error={!social.url || social.url.trim() === "" || !!error}
                disable={disable}
              />
            ))}

            {hasEmptyFields && (
              <p className="text-sm font-medium text-destructive">
                Please fill in all social media URLs
              </p>
            )}
            {value?.length >= maxSocials && (
              <p className="text-center text-sm text-muted-foreground">
                Maximum number of social links reached ({maxSocials})
              </p>
            )}
          </div>
        </FormControl>
        {error && <FormMessage />}
      </FormItem>
    );
  },
);

SocialInput.displayName = "SocialInput";

export default SocialInput;
