// import { useState, useRef, useCallback } from "react";
// import { Map, Search } from "lucide-react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";

// // Map container style
// const mapContainerStyle = {
//   width: "100%",
//   height: "100%",
// };

// // The API key you're currently using might be invalid or restricted
// // Get a proper API key from Google Cloud Console
// const GOOGLE_MAPS_API_KEY = "YOUR_VALID_API_KEY";

// // Libraries to load with Google Maps
// const libraries = ["places"];

// function GoogleMapComp() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState({
//     lat: 40.7128, // Default to New York City coordinates
//     lng: -74.0060,
//     name: "New York City",
//   });
//   const [center, setCenter] = useState({
//     lat: 40.7128,
//     lng: -74.0060,
//   });

//   const mapRef = useRef(null);

//   // Load the Google Maps JS API
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const handleSearch = useCallback(() => {
//     if (!isLoaded || !window.google) return;

//     try {
//       // Using Google Maps Geocoding API
//       const geocoder = new window.google.maps.Geocoder();

//       geocoder.geocode({ address: searchQuery }, (results, status) => {
//         if (status === "OK" && results && results[0]) {
//           const location = results[0].geometry.location;
//           const newLocation = {
//             lat: location.lat(),
//             lng: location.lng(),
//             name: results[0].formatted_address,
//           };

//           setSelectedLocation(newLocation);
//           setCenter(newLocation);
//         } else {
//           console.error(
//             "Geocode was not successful for the following reason:",
//             status,
//           );
//         }
//       });
//     } catch (error) {
//       console.error("Error searching location:", error);
//     }
//   }, [isLoaded, searchQuery]);

//   const handleMapClick = useCallback((event) => {
//     if (!isLoaded || !window.google) return;
    
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     // Reverse geocoding to get location name
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === "OK" && results && results[0]) {
//         setSelectedLocation({
//           lat,
//           lng,
//           name: results[0].formatted_address || "Unknown location",
//         });
//       } else {
//         setSelectedLocation({
//           lat,
//           lng,
//           name: "Unknown location",
//         });
//         console.error("Geocoder failed due to:", status);
//       }
//     });
//   }, [isLoaded]);

//   const onMapLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   // Handle loading error
//   if (loadError) {
//     return (
//       <div className="flex h-full items-center justify-center p-4 text-center">
//         <div>
//           <p className="text-lg font-semibold text-red-500">Error loading Google Maps</p>
//           <p className="mt-2 text-sm text-gray-600">
//             There was an error loading the map. Please check your API key and try again.
//           </p>
//           <p className="mt-1 text-xs text-gray-500">
//             Error: {loadError.message}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-svh flex-col items-center justify-center">
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button>
//             <Map className="mr-2 size-4" />
//             <span>Open Map</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle>Location Finder</SheetTitle>
//             <SheetDescription>
//               Search for a location or click on the map to select a point.
//             </SheetDescription>
//           </SheetHeader>

//           <Separator className="my-6" />

//           <div className="flex flex-col gap-6">
//             <div className="mb-4 flex gap-2">
//               <Input
//                 type="text"
//                 value={searchQuery}
//                 className="flex-1"
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search for a location..."
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               />
//               <Button size="icon" type="button" onClick={handleSearch}>
//                 <Search className="size-5" />
//               </Button>
//             </div>

//             <div className="aspect-[1.4] overflow-hidden rounded-lg border">
//               {!isLoaded ? (
//                 <div className="flex h-full items-center justify-center">
//                   <p>Loading Maps...</p>
//                 </div>
//               ) : (
//                 <GoogleMap
//                   mapContainerStyle={mapContainerStyle}
//                   center={center}
//                   zoom={13}
//                   onClick={handleMapClick}
//                   onLoad={onMapLoad}
//                   options={{
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                   }}
//                 >
//                   <Marker
//                     position={{
//                       lat: selectedLocation.lat,
//                       lng: selectedLocation.lng,
//                     }}
//                   />
//                 </GoogleMap>
//               )}
//             </div>

          
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

// export default GoogleMapComp;



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

interface Location {
  lat: number;
  lng: number;
  name: string;
}

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

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] =
    useState<Location>(defaultLocation);
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
        setSelectedLocation({
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          name: display_name,
        });
        setCenter([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleMapClick = useCallback((latlng: LatLng) => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
        );
        const data = await response.json();

        setSelectedLocation({
          lat: latlng.lat,
          lng: latlng.lng,
          name: data.display_name || "Unknown location",
        });
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    };
    fetchLocationName();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50svh]">
      <Sheet>
        <SheetTrigger asChild>
          <Button>
            <Map className="!size-6" />
            <span>Open Map</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Location Finder</SheetTitle>
            <SheetDescription>
              Search for a location or click on the map to select a point.
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-6" />

          <div className="flex flex-col gap-6">
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={searchQuery}
                className="flex-1"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a location..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="icon" type="button" onClick={handleSearch}>
                <Search className="!size-5" />
              </Button>
            </div>

            <div className="aspect-[1.4] rounded-lg overflow-hidden border">
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
    </div>
  );
}

export default App;
