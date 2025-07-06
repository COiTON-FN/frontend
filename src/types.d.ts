declare module "country-region-data/dist/data-umd" {
  const data: [string, any][];

  export default data;
}

declare interface ListingBoardProps {
  placeholder: string;
  options: string[];
}

declare interface LocationData {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

declare interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}
