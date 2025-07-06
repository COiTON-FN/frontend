import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { LatLng, Icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const defaultLocation = {
  lat: 9.600036,
  lng: 7.999972,
  name: "Nigeria",
};

const customIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 51],
  iconAnchor: [12, 41],
});

function MapEvents({
  onLocationSet,
}: {
  onLocationSet: (location: LatLng) => void;
}) {
  useMapEvents({
    click: (e) => {
      console.log("Map clicked at:", e.latlng);
      onLocationSet(e.latlng);
    },
  });
  return null;
}

function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
}

interface MapPickerProps {
  error?: boolean;
  value: MapLocation;
  onChange: (value: MapLocation) => void;
}

export function MapPicker({ onChange, error }: MapPickerProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [center, setCenter] = useState<[number, number]>([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}`,
      );
      const data = await response.json();

      if (data && data[0]) {
        const { lat, lon, display_name } = data[0];
        const location = {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          name: display_name,
        };
        setSelectedLocation(location);
        setCenter([location.lat, location.lng]);
        onChange(location);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = useCallback(
    (latlng: LatLng) => {
      const fetchLocationName = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
          );
          const data = await response.json();
          const name = data.display_name || "Unknown location";

          const newLocation = {
            lat: latlng.lat,
            lng: latlng.lng,
            name,
          };

          setSelectedLocation(newLocation);
          onChange(newLocation);
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
      };
      fetchLocationName();
    },
    [onChange],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          role="button"
          className={cn(
            "flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border bg-background px-5",
            {
              "border-destructive": error,
            },
          )}
        >
          {selectedLocation.name.toLowerCase() !== "nigeria" ? (
            <p className="truncate text-sm font-normal tracking-wide sm:text-base">
              {selectedLocation.name}
            </p>
          ) : (
            <p className="flex items-center gap-2.5 text-sm font-normal tracking-wide text-muted-foreground sm:text-[15px]">
              <Search className="!size-5" />
              <span>Search location</span>
            </p>
          )}
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-sans">Location Finder</SheetTitle>
          <SheetDescription>
            Search for a location or click on the map to select a point.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-6" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              className="!h-12 flex-1"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
            />
            <Button
              size="icon"
              type="button"
              isLoading={isSearching}
              className="size-11 rounded-lg"
              onClick={handleSearch}
            >
              <Search className="size-5" />
            </Button>
          </div>

          <div className="aspect-[1.4] h-[300px] w-full overflow-hidden rounded-lg border">
            <MapContainer
              center={center}
              zoom={6}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <FixMapResize />
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <MapEvents onLocationSet={handleMapClick} />
              <Marker
                key={`${selectedLocation.lat}-${selectedLocation.lng}`}
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={customIcon}
              />
            </MapContainer>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-md bg-secondary p-4">
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">Location:</p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.name}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">Latitude:</p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.lat}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">Longitude:</p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.lng}
              </p>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MapPicker;
