import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TradingPage() {
  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="relative flex h-[300px] md:h-[363px] w-full items-center overflow-clip rounded-2xl md:rounded-3xl border bg-[#FCFCFC] p-[1px]">
        <div className="space-y-1 px-10 md:px-16 py-11">
          <svg
            width="227"
            height="153"
            viewBox="0 0 227 153"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M124.088 129.854V147.252L78.6328 120.998V103.619L124.088 129.854Z"
              fill="#E0FDFB"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M128.993 57.9429L84.765 83.1547L48.6871 103.734L5.51953 29.2888L16.3114 23.0928L48.6871 78.9497L73.9546 64.5296L84.765 58.3708L118.182 39.3177L119.318 41.29L128.993 57.9429Z"
              fill="#E0FDFB"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M161.307 126.507V128.647L124.094 147.254V129.856L140.226 121.8L154.385 129.968L159.316 127.493L161.307 126.507Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M191.593 109.258V111.361L161.301 126.507L159.31 127.493L154.379 129.967V112.589L159.329 110.114L170.53 104.514L184.689 112.701L189.639 110.226L191.593 109.258Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M221.909 76.6963V94.0934L191.599 109.258L189.645 110.225L184.695 112.7V95.3028L189.626 92.8468L205.758 84.7715L221.909 76.6963Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M221.903 76.6981L205.753 84.7734L189.621 92.8486L184.69 95.3047L146.137 73.0513L141.188 70.2044L139.234 69.0694L176.447 50.4629L221.903 76.6981Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M166.206 39.335L85.9006 85.1257L48.6875 103.732L84.7654 83.1534L128.993 57.9415L166.206 39.335Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M166.215 39.3351L129.002 57.9417L119.327 41.2888L118.191 39.3165L155.405 20.71L166.215 39.3351Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M84.7701 58.37L73.9595 64.5287L48.6921 78.9488L16.3164 23.0919L53.5295 4.48535L84.7701 58.37Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M140.221 121.799L124.088 129.856L78.6328 103.62L108.924 88.4746V103.732L140.221 121.799Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M154.378 112.59V129.968L140.218 121.8L108.922 103.733V86.3359L110.913 87.4895L115.844 90.3363L154.378 112.59Z"
              fill="#E0FDFB"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M170.528 104.513L159.327 110.113L154.378 112.588L115.844 90.3346L110.913 87.4878L108.922 86.3342L139.232 71.1885V86.4459L170.528 104.513Z"
              stroke="black"
              strokeWidth="1.86066"
            />
            <path
              d="M184.69 95.3036V112.701L170.531 104.514L139.234 86.4469V69.0684L141.188 70.2034L146.137 73.0502L184.69 95.3036Z"
              fill="#E0FDFB"
              stroke="black"
              strokeWidth="1.86066"
            />
          </svg>

          <h3 className="text-4xl md:text-5xl italic text-primary font-normal">
            Trading
          </h3>
          <p className="text-base md:text-xl text-muted-foreground">
            Invest, Verify, and Unlock Real Estate Potential
          </p>
        </div>

        <img
          src={assets.shapes.clyShape}
          className="absolute hidden sm:flex md:hidden lg:flex -right-56 xl:-right-24 top-4"
        />
      </div>

      <Separator className="h-px w-full my-2" />

      <div className="relative flex w-full items-center justify-between gap-8 overflow-clip rounded-2xl md:rounded-3xl bg-[#08847B] p-8 text-white md:gap-10 md:p-10">
        <div className="h-[768px] flex-1 hidden xl:flex bg-primary rounded-2xl"></div>

        <div className="flex xl:h-[642px] w-full xl:w-[470px] flex-col lg:flex-row xl:flex-col gap-6 justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-normal">Coming Soon</h2>
            <p className="text-lg font-light">
              We are working 24/7 to make sure that this update drops ASAP.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-center">
              Click link to get notified when we drop the sweetness
            </p>
            <Button size={"lg"} variant={"secondary"} className="rounded-full">
              <span className="text-primary">Join Waitlist</span>
              <svg
                width="24"
                height="23"
                viewBox="0 0 24 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.126 3.10059C7.71996 3.10672 5.93636 3.19035 4.7965 4.33039C3.56641 5.56069 3.56641 7.54082 3.56641 11.501C3.56641 15.4613 3.56641 17.4415 4.7965 18.6717C6.02659 19.9021 8.00641 19.9021 11.9661 19.9021C15.9256 19.9021 17.9055 19.9021 19.1356 18.6717C20.2754 17.5317 20.359 15.7478 20.3652 12.3412"
                  stroke="#056F67"
                  strokeWidth="1.58333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.9525 3.5631L11.0781 12.489M19.9525 3.5631C19.4914 3.10142 16.3852 3.14445 15.7286 3.1538M19.9525 3.5631C20.4136 4.02479 20.3706 7.13496 20.3612 7.79248"
                  stroke="#056F67"
                  strokeWidth="1.58333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
