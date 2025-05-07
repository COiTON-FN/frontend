import { useState, useCallback } from "react";
import { Map, Search } from "lucide-react";
import { LatLng, Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
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

interface MapPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function MapPicker({  onChange }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [center, setCenter] = useState<[number, number]>([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);

  const handleSearch = async () => {
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
        setCenter([location.lat, location.lng]);
        onChange(display_name); // 🔥 Send to form
      }
    } catch (error) {
      console.error("Error searching location:", error);
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
          onChange(name); //  Send to form
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
        <Button variant="outline" className="w-full rounded-xl">
          <Map className="mr-2 h-4 w-4" />
          Open Map
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Location Finder</SheetTitle>
          <SheetDescription>
            Search or click on the map to pick a location.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-6" />

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <Input
              type="text"
              value={searchQuery}
              className="flex-1"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button size="icon" type="button" onClick={handleSearch}>
              <Search className="size-5" />
            </Button>
          </div>

          <div className="aspect-[1.4] overflow-hidden rounded-lg border">
            <MapContainer
              center={center}
              zoom={13}
              className="h-full w-full"
              key={center.join(",")}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
                url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38"
              />
              <MapEvents onLocationSet={handleMapClick} />
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={customIcon}
              />
            </MapContainer>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default MapPicker;

