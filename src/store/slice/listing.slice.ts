import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./credential.slice";

export interface I_LISTING_DETAILS {
  split(arg0: string): string;
  owner?: string;
  email: string;
  phone: string;
  propertyType: string;
  listingType: "Rent" | "Sale";
  title: string;
  country: string;
  location: {
    name: string;
    latitude: string;
    longitude: string;
  };
  price: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqft: string;
  landArea: string;
  parkingSpaces: string;
  yearBuilt: Date;
  banner?: File;
  bannerCid?: string;
  photos?: File[];
  photoCids?: string[];
  media?: File[];
  mediaCid?: string[];
  propertyDocuments?: File[];
  documentCids?: string[];
  document?: File[];
  documentCid?: string[];
  social: string | undefined;
  occupation: string | undefined;
  amenities: string[] | undefined;
  createdAt?: string;
}

export type ListingTag = "Sold"|"ForSale";

export type Listing = {
    id: number,
     details: any,
     owner: string,
     price: number,
     tag: ListingTag,
     owner_details:User|undefined
}

export type PurchaseRequest =  {
     listing_id: number,
     request_id: number,
     price: number,
     initiator: string,
     user?: User
}

export interface I_LISTING_SLICE {
  id: number;
  hash: string;
  owner: string;
  details: I_LISTING_DETAILS;
}

interface I_LISTING_STATE {
  // approved: I_LISTING_SLICE[];
  // unapproved: I_LISTING_SLICE[];
  listings:Listing[];
  isLoading: boolean;
  error: string | null;
}

const initialState: I_LISTING_STATE = {
  listings: [],
  // unapproved: [],
  isLoading: false,
  error: null,
};

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setListing: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;
    },
    addListing: (state, action: PayloadAction<Listing>) => {
      state.listings.push(action.payload);
    },
  },
});

export const { setListing,addListing } = listingSlice.actions;

export default listingSlice.reducer;
