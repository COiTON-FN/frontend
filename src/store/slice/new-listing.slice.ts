import { lcStorage } from "@/lib/utils";
import {
  BuildingFormSchemaProps,
  LandFormSchemaProps,
} from "@/utils/validators";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { openDB } from "idb";

const DB_NAME = "ListingFormDB";
const STORE_NAME = "files";

export const initDB = async () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

export const saveFile = async (key: string, file: File[]) => {
  const db = await initDB();
  await db.put(STORE_NAME, file, key);
};

export const getFile = async (key: string): Promise<File[] | null> => {
  const db = await initDB();
  const result = await db.get(STORE_NAME, key);
  return result || null;
};

export const clearFile = async (key: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
};

interface FormState {
  formStep: number;
  formData: Partial<BuildingFormSchemaProps | LandFormSchemaProps>;
}

const savedFormData =
  lcStorage.load<Partial<BuildingFormSchemaProps | LandFormSchemaProps>>(
    "new_listing",
  ) || {};

const initialState: FormState = {
  formStep: 1,
  formData: savedFormData,
};

const listProperty = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormStep: (state, action: PayloadAction<number>) => {
      state.formStep = action.payload;
    },
    updateListingFormData: (
      state,
      action: PayloadAction<
        Partial<BuildingFormSchemaProps | LandFormSchemaProps>
      >,
    ) => {
      state.formData = { ...state.formData, ...action.payload };

      // @ts-ignore
      const { images, videos, license, floorPlan, ...serializableData } =
        state.formData;

      if (images) saveFile("images", images);
      if (videos) saveFile("videos", videos);
      if (license) saveFile("license", license);
      if (floorPlan) saveFile("floorPlan", floorPlan);

      lcStorage.save("new_listing", serializableData);
    },
    resetListingForm: (state) => {
      state.formStep = 1;
      state.formData = {};
    },
  },
});

export const { setFormStep, updateListingFormData, resetListingForm } =
  listProperty.actions;
export default listProperty.reducer;
