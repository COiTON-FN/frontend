import axios, { AxiosError } from "axios";

type InspectionProps = {
  id: string;
  data: {
    title: string;
    description: string;
    start: string;
    duration: [number, string];
  };
};

export const inspection = async ({ id, data }: InspectionProps) => {
  try {
    console.log("📤 Sending to API:", { id, data });
    const response = axios.post(
      `${import.meta.env.VITE_RENDER_ENDPOINT}/inspection`,
      {
        id,
        data,
      },
    );
    console.log("✅ API response:", (await response).data?.data);
    return (await response).data?.data;
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof AxiosError) {
      // Throw error with the message from the API
      throw new Error(error.response?.data?.message || "Something Went Wrong");
    }
    console.error("❌ Unexpected Error:", error); // <== Add this
    throw new Error("An unexpected error occurred");
  }
};
