import * as React from "react";
import { Icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { Listing } from "@/store/slice/listing.slice";
import { useTheme } from "@/components/provider/theme.provider";

const customIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 51],
  iconAnchor: [12, 41],
});

interface ListingMapProps {
  listing: Listing | null;
}

export const ListingMap: React.FC<ListingMapProps> = ({ listing }) => {
  const { resolvedTheme } = useTheme();

  return (listing?.details?.map?.name &&
    listing?.details?.map?.lat &&
    listing?.details?.map?.long) ||
    listing?.details?.map?.lng ? (
    <div className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl md:rounded-3xl">
      <MapContainer
        center={[
          listing?.details?.map?.lat,
          listing?.details?.map?.long || listing?.details?.map?.lng,
        ]}
        zoom={6}
        className="h-full w-full"
        key={[
          listing?.details?.map?.lat,
          listing?.details?.map?.long || listing?.details?.map?.lng,
        ].join(",")}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={
            resolvedTheme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />

        <Marker
          position={[
            listing?.details?.map?.lat,
            listing?.details?.map?.long || listing?.details?.map?.lng,
          ]}
          icon={customIcon}
        />
      </MapContainer>
    </div>
  ) : (
    <div
      dangerouslySetInnerHTML={{ __html: listing?.details?.map }}
      className="-z-0 aspect-[1.4] w-full flex-1 overflow-hidden rounded-xl border bg-secondary sm:rounded-2xl md:rounded-3xl"
    ></div>
  );
};
