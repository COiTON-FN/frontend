import { Outlet } from "react-router-dom";

export default function OnboardingLayout() {


  return (
    <div className="flex h-full flex-col">
      {/* {isCheckingRegStatus && (
        <div className="pointer-events-auto fixed left-0 top-0 z-50 flex size-full select-none items-center justify-center overflow-hidden bg-foreground/40 backdrop-blur-lg">
          <Loader className="size-8 animate-spin text-background" />
        </div>
      )} */}
      <Outlet />
    </div>
  );
}
