import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { LatLng, Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

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
      onLocationSet(e.latlng);
    },
  });
  return null;
}

interface MapLocation {
  lat: number;
  long: number;
  name: string;
}

interface MapPickerProps {
  value: MapLocation;
  onChange: (value: MapLocation) => void;
}


export function MapPicker({ onChange }: MapPickerProps) {
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
          searchQuery
        )}`
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
        setCenter([parseFloat(lat), parseFloat(lon)]);
        onChange({
          lat: location.lat,
          long: location.lng,
          name: display_name,
        });
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
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
          );
          const data = await response.json();

          const name = data.display_name || "Unknown location";

          setSelectedLocation({
            lat: latlng.lat,
            lng: latlng.lng,
            name,
          });
          onChange({
            lat: latlng.lat,
            long: latlng.lng,
            name,
          });
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
      };
      fetchLocationName();
    },
    [onChange]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div role="button" className="cursor-pointer h-14 rounded-xl border w-full flex items-center bg-background px-5 justify-between">
          {selectedLocation.name.toLowerCase() !== "nigeria" ?
          <p className="text-sm sm:text-base tracking-wide font-normal truncate">{selectedLocation.name}</p> :
            <p className="text-sm sm:text-base tracking-wide font-normal text-muted-foreground flex items-center gap-2.5">
              <Search className="!size-5" />
              <span>Search location</span>
            </p>
          }
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
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={searchQuery}
              className="flex-1 !h-12"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
            />
            <Button size="icon" type="button" isLoading={isSearching} className="rounded-lg size-11" onClick={handleSearch}>
              <Search className="size-5" />
            </Button>
          </div>

          <div className="aspect-[1.4] overflow-hidden rounded-lg border">
            <MapContainer
              center={center}
              zoom={6}
              className="h-full w-full"
              key={center.join(",")}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEvents onLocationSet={handleMapClick} />
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={customIcon}
              />
            </MapContainer>
          </div>

          <div className="p-4 bg-secondary rounded-md flex flex-col gap-2 w-full">
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">
                Location:
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.name}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">
                Latitude:
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.lat.toFixed(6)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-normal text-primary">
                Longitude:
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {selectedLocation.lng.toFixed(6)}
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
