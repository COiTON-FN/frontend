import { variables } from "./variables";

export type InspectionProps = {
  type: "create" | "update";
  payload: {
    id: string;
    data: {
      title: string;
      description: string;
      start: string;
      duration: [number, string];
    };
  };
};

export const inspection = async ({ type, payload }: InspectionProps) => {
  const endpoint =
    type === "update" && payload.id ? `inspection/${payload.id}` : "inspection";

  const method = type === "update" ? "PUT" : "POST";

  const fullEndpoint = `${variables.renderEndpoint}/${endpoint}`;

  try {
    console.log("📤 Sending to API:", { type, payload });

    const response = await fetch(fullEndpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("✅ API response:", responseData?.data);
    return responseData?.data;
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      // Throw error with the message from the API
      throw new Error(JSON.stringify(error) || "Something Went Wrong");
    }
    console.error("❌ Unexpected Error:", error); // <== Add this
    throw new Error("An unexpected error occurred");
  }
};
