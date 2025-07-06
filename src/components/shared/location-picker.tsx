import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "/marker.svg",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
}

// Component to handle map clicks
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) {
  const [location, setLocation] = useState<LocationData | null>(
    initialLocation || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    9.600036, 7.999972,
  ]); // Default to NYC
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.warn("Could not get user location:", error);
        },
      );
    }
  }, [initialLocation]);

  // Search for locations using Nominatim API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      );
      const results: GeocodeResult[] = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: GeocodeResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const locationData: LocationData = {
      name: result.display_name,
      lat,
      lng,
      address: result.address
        ? `${result.address.house_number || ""} ${result.address.road || ""}, ${result.address.city || ""}, ${result.address.state || ""}, ${result.address.country || ""}`.trim()
        : undefined,
    };

    setLocation(locationData);
    setMapCenter([lat, lng]);
    setSearchQuery("");
    setSearchResults([]);
    onLocationSelect(locationData);
  };

  // Handle map click for location selection
  const handleMapClick = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      );
      const result: GeocodeResult = await response.json();

      const locationData: LocationData = {
        name: result.display_name,
        lat,
        lng,
        address: result.address
          ? `${result.address.house_number || ""} ${result.address.road || ""}, ${result.address.city || ""}, ${result.address.state || ""}, ${result.address.country || ""}`.trim()
          : undefined,
      };

      setLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      console.error("Geocoding error:", error);
      // Fallback to coordinates only
      const locationData: LocationData = {
        name: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        lat,
        lng,
      };
      setLocation(locationData);
      onLocationSelect(locationData);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative">
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              id="location-search"
              placeholder="Enter city, address, or landmark..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-1">
            {searchResults.map((result, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto w-full justify-start p-3 text-left"
                onClick={() => handleSearchResultSelect(result)}
              >
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="line-clamp-2 text-sm text-foreground">
                  {result.display_name}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Current Selection */}
      {location && (
        <div className="flex items-start space-x-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {location.name}
            </p>
            {location.address && (
              <p className="mt-1 text-xs text-muted-foreground">
                {location.address}
              </p>
            )}
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="relative">
        <div className="h-[400px] w-full overflow-hidden rounded-lg border border-border">
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleMapClick} />
            {location && (
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <div className="text-sm">
                    <strong>{location.name}</strong>
                    {location.address && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {location.address}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-xs">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        {isGeocoding && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/50">
            <div className="flex items-center space-x-2 rounded-lg border border-border bg-background p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Getting location details...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
