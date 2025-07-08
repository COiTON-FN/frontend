import { assets } from "@/assets";
import { SEO } from "@/components/shared/seo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site.config";
import React from "react";
import { RiUserCommunityFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function TradingPage() {
  return (
    <React.Fragment>
      <SEO page="trade" />

      <div className="flex flex-col gap-4 py-4">
        <div className="relative flex h-[300px] w-full items-center overflow-clip rounded-2xl border bg-background p-[1px] md:h-[363px] md:rounded-3xl">
          <div className="space-y-1 p-10 lg:p-16">
            <svg
              width="227"
              height="153"
              viewBox="0 0 227 153"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-black dark:stroke-secondary"
            >
              <path
                d="M124.088 129.854V147.252L78.6328 120.998V103.619L124.088 129.854Z"
                fill="#E0FDFB"
                strokeWidth="1.86066"
              />
              <path
                d="M128.993 57.9429L84.765 83.1547L48.6871 103.734L5.51953 29.2888L16.3114 23.0928L48.6871 78.9497L73.9546 64.5296L84.765 58.3708L118.182 39.3177L119.318 41.29L128.993 57.9429Z"
                fill="#E0FDFB"
                strokeWidth="1.86066"
              />
              <path
                d="M161.307 126.507V128.647L124.094 147.254V129.856L140.226 121.8L154.385 129.968L159.316 127.493L161.307 126.507Z"
                strokeWidth="1.86066"
              />
              <path
                d="M191.593 109.258V111.361L161.301 126.507L159.31 127.493L154.379 129.967V112.589L159.329 110.114L170.53 104.514L184.689 112.701L189.639 110.226L191.593 109.258Z"
                strokeWidth="1.86066"
              />
              <path
                d="M221.909 76.6963V94.0934L191.599 109.258L189.645 110.225L184.695 112.7V95.3028L189.626 92.8468L205.758 84.7715L221.909 76.6963Z"
                strokeWidth="1.86066"
              />
              <path
                d="M221.903 76.6981L205.753 84.7734L189.621 92.8486L184.69 95.3047L146.137 73.0513L141.188 70.2044L139.234 69.0694L176.447 50.4629L221.903 76.6981Z"
                strokeWidth="1.86066"
              />
              <path
                d="M166.206 39.335L85.9006 85.1257L48.6875 103.732L84.7654 83.1534L128.993 57.9415L166.206 39.335Z"
                strokeWidth="1.86066"
              />
              <path
                d="M166.215 39.3351L129.002 57.9417L119.327 41.2888L118.191 39.3165L155.405 20.71L166.215 39.3351Z"
                strokeWidth="1.86066"
              />
              <path
                d="M84.7701 58.37L73.9595 64.5287L48.6921 78.9488L16.3164 23.0919L53.5295 4.48535L84.7701 58.37Z"
                strokeWidth="1.86066"
              />
              <path
                d="M140.221 121.799L124.088 129.856L78.6328 103.62L108.924 88.4746V103.732L140.221 121.799Z"
                strokeWidth="1.86066"
              />
              <path
                d="M154.378 112.59V129.968L140.218 121.8L108.922 103.733V86.3359L110.913 87.4895L115.844 90.3363L154.378 112.59Z"
                fill="#E0FDFB"
                strokeWidth="1.86066"
              />
              <path
                d="M170.528 104.513L159.327 110.113L154.378 112.588L115.844 90.3346L110.913 87.4878L108.922 86.3342L139.232 71.1885V86.4459L170.528 104.513Z"
                strokeWidth="1.86066"
              />
              <path
                d="M184.69 95.3036V112.701L170.531 104.514L139.234 86.4469V69.0684L141.188 70.2034L146.137 73.0502L184.69 95.3036Z"
                fill="#E0FDFB"
                strokeWidth="1.86066"
              />
            </svg>

            <h3 className="text-4xl font-normal italic text-primary md:text-5xl">
              Trading
            </h3>
            <p className="text-base text-muted-foreground md:text-xl">
              Invest, Verify, and Unlock Real Estate Potential
            </p>
          </div>

          <img
            src={assets.shapes.clyShape}
            className="absolute -right-56 top-4 hidden sm:flex md:hidden lg:flex xl:-right-24"
          />
        </div>

        <Separator className="my-2 h-px w-full" />

        <div className="relative grid grid-cols-1 gap-5 overflow-clip rounded-2xl bg-[#08847B] p-5 text-white sm:gap-6 sm:p-6 md:gap-8 md:rounded-3xl md:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10 xl:grid-cols-3">
          <div className="h-max flex-1 rounded-2xl bg-primary xl:col-span-2">
            <img
              src="/blocks.svg"
              alt="blocks"
              width="755"
              height="657"
              className="m-auto"
            />
          </div>

          <div className="flex w-full flex-col justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-normal">Coming Soon</h2>
              <p className="text-sm font-normal md:text-base">
                Implementing this functionality is a top priority for the team.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-center">Want to get notified?</p>
              <Link
                to={siteConfig.social.telegram}
                target="_blank"
                className="w-full"
              >
                <Button
                  size={"lg"}
                  variant={"black"}
                  className="group w-full rounded-full"
                >
                  <span>Join the Community</span>
                  <RiUserCommunityFill className="size-5 transition-all duration-300 group-hover:rotate-[360deg]" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
