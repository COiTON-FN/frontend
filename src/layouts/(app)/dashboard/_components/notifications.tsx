import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobileHook } from "@/hooks/useMobile.hook";
import { RiNotification3Line } from "react-icons/ri";

const Notifications = () => {
  const isMobile = useIsMobileHook();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={buttonVariants({
            size: "icon",
            variant: "outline",
            className: "rounded-full border",
          })}
        >
          <RiNotification3Line className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        align={isMobile ? "center" : "end"}
        className="mr-6 w-96 md:mr-0"
      >
        <div className="flex aspect-video items-center justify-center">
          <p className="text-muted-foreground">
            Notifications feature coming soon.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
