import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LocationPicker } from "./location-picker";
import { cn } from "@/lib/utils";

interface LocationFieldProps {
  placeholder?: string;
  value?: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LocationField({
  placeholder = "Select Location",
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}: LocationFieldProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    onChange(location);
    setIsSheetOpen(false);
    toast.success("Location selected successfully!");
  };

  const handleClearLocation = () => {
    onChange(null);
    toast.success("Location cleared");
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {value ? (
        <div className="flex items-start justify-between gap-4 rounded-xl border p-3">
          <div className="flex flex-1 items-start gap-2">
            <MapPin className="mt-0.5 size-5 text-primary" />
            <div className="flex-1">
              <p className="line-clamp-1 flex-1 text-base font-medium text-foreground">
                {value.name}
              </p>
              {value.address && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {value.address}
                </p>
              )}
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled}>
                  Change
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-[600px]">
                <SheetHeader>
                  <SheetTitle>Select Location</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={value}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearLocation}
              disabled={disabled}
              className="size-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-start gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                disabled={disabled}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "!h-max w-full !items-start !justify-start rounded-xl border-dashed py-5",
                })}
              >
                <Plus className="mr-4 mt-1 size-5" />
                <div className="text-left">
                  <div className="text-base">{placeholder}</div>
                  <div className="text-sm text-muted-foreground">
                    Click to open map and choose your location
                  </div>
                </div>
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-sans">Select Location</SheetTitle>
                <SheetDescription>
                  Search for a location or click on the map to select a location
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <LocationPicker onLocationSelect={handleLocationSelect} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
