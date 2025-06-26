import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  copyToClipboard,
  generateAvatarFromAddress,
  truncateAddr,
} from "@/lib/utils";
import { TbCopy } from "react-icons/tb";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { HiOutlineLink } from "react-icons/hi2";
import { SOCIAL } from "@/components/extension/social-input";
import { User } from "@/store/slice/credential.slice";
import { MdVerified } from "react-icons/md";

interface ProfileCardProps {
  credentialStore: User | null;
}

const ProfileCard: FC<ProfileCardProps> = ({ credentialStore }) => {
  return (
    <div className="flex w-full flex-col rounded-2xl sm:border sm:bg-background xl:w-[40%]">
      <div className="flex flex-col gap-4 border-b py-6 sm:p-6 md:gap-10 md:p-10">
        <div className="size-32 rounded-[40px] border bg-background p-1 md:size-48">
          <div className="size-full rounded-[36px] border bg-secondary">
            <img
              src={generateAvatarFromAddress(
                credentialStore?.address as string,
              )}
              alt={credentialStore?.address as string}
              width={192}
              height={192}
              className="size-full rounded-[32px] object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="mb-2 flex items-center gap-1.5">
            <p className="text-2xl font-medium capitalize md:text-3xl">
              {credentialStore?.details?.name}
            </p>
            {credentialStore?.user_type === "Entity" ? (
              credentialStore.verified ? (
                <MdVerified className="mt-px size-6 text-primary" />
              ) : (
                <div className="rounded-full border border-red-500 px-3 py-1 text-sm font-bold text-red-500">
                  Not verified
                </div>
              )
            ) : null}
          </div>

          {credentialStore?.user_type === "Entity" ? (
            <div className="flex items-center gap-2">
              <svg
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
              >
                <path
                  d="M9.75 23.8336C10.1398 23.8336 11.5817 23.1756 13.0535 21.8596M13.0535 21.8596C14.3085 20.7373 15.5852 19.1366 16.25 17.0576C17.6944 12.5402 9.02777 17.0576 11.9167 20.8221C12.2721 21.2852 12.655 21.6237 13.0535 21.8596ZM13.0535 21.8596C14.7898 22.8867 16.8254 21.9638 18.2044 20.9025C18.626 20.5782 18.8367 20.416 18.9624 20.4665C19.0883 20.517 19.1618 20.8072 19.3089 21.3877C19.7796 23.2453 21.17 24.7447 22.75 22.3283"
                  stroke="#141B34"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.6667 14.0837V8.54861C21.6667 6.69139 21.6667 5.76278 21.3763 5.02113C20.9097 3.82881 19.9227 2.88833 18.6715 2.44362C17.8932 2.16699 16.9187 2.16699 14.9697 2.16699C11.559 2.16699 9.8536 2.16699 8.49156 2.65109C6.3019 3.42932 4.57471 5.07518 3.75802 7.16172C3.25 8.45963 3.25 10.0847 3.25 13.3349V16.1267C3.25 19.4934 3.25 21.1767 4.16834 22.3457C4.43146 22.6806 4.74351 22.9779 5.09499 23.2287C5.49267 23.5123 5.94708 23.7041 6.5 23.8337"
                  stroke="#141B34"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.25 13.0003C3.25 11.0059 4.86675 9.38922 6.86111 9.38922C7.58238 9.38922 8.43271 9.5156 9.13398 9.3277C9.75706 9.16073 10.2437 8.67406 10.4107 8.05097C10.5986 7.3497 10.4722 6.49937 10.4722 5.7781C10.4722 3.78374 12.089 2.16699 14.0833 2.16699"
                  stroke="#141B34"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-base font-medium">
                {credentialStore?.user_type}
              </p>
              <div className="rounded-full border border-muted-foreground/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                Core
              </div>
            </div>
          ) : null}

          {credentialStore?.address && (
            <div className="flex items-center gap-3 md:gap-4">
              <p className="text-sm font-medium md:text-base">
                {truncateAddr(credentialStore?.address)}
              </p>
              <TbCopy
                role="button"
                onClick={() => copyToClipboard(credentialStore?.address)}
                className="size-4 md:size-5"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[750px] flex-col gap-4 py-6 sm:p-6 md:gap-6 md:p-10 xl:max-w-[500px]">
        <div className="flex items-center justify-between">
          <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
            Country
          </p>
          <p className="text-sm font-medium sm:text-base md:text-lg">
            {credentialStore?.details?.region?.country
              ? credentialStore?.details?.region?.country?.countryName
              : credentialStore?.details?.region[0]}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
            State
          </p>
          <p className="text-sm font-medium sm:text-base md:text-lg">
            {credentialStore?.details?.region?.state
              ? credentialStore?.details?.region?.state?.stateName
              : credentialStore?.details?.region[1]}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
            Phone
          </p>
          <p className="text-sm font-medium sm:text-base md:text-lg">
            {credentialStore?.details?.phone?.national}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="w-full max-w-[125px] text-sm text-muted-foreground sm:text-base md:text-lg">
            Email
          </p>
          <p className="text-sm font-medium sm:text-base md:text-lg">
            {credentialStore?.details?.email}
          </p>
        </div>

        <div className="mx-auto mt-6 flex w-full items-center justify-start gap-2">
          {credentialStore?.details?.socials?.map((social: SOCIAL) => {
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
              <Link key={social?.id} to={social?.url} target="_blank">
                <Button size={"icon"} className="rounded-[8px]">
                  <IconComponent className="size-6" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
