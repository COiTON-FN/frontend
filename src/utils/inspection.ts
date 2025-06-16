import { variables } from "./variables";

export type BasePayload = {
  id: string;
  data: {
    title: string;
    description: string;
    start: string;
    duration: [number, string];
  };
};

export type InspectionProps =
  | { type: "create"; payload: Omit<BasePayload, "id"> }
  | { type: "get" | "update" | "delete"; payload: { id: string } };

export const inspection = async ({ type, payload }: InspectionProps) => {
  const id = payload && "id" in payload ? payload.id : undefined;

  const endpoint =
    type === "create"
      ? "inspection"
      : id
        ? `inspection/${id}`
        : (() => {
            throw new Error("ID is required for this operation");
          })();

  const method =
    type === "create"
      ? "POST"
      : type === "get"
        ? "GET"
        : type === "update"
          ? "PUT"
          : "DELETE";

  const fullEndpoint = `${variables.renderEndpoint}/${endpoint}`;

  try {
    const response = await fetch(fullEndpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: type === "get" ? undefined : JSON.stringify(payload),
    });

    const responseData = await response.json();
    if (!responseData?.success) {
      throw new Error(`Error: ${responseData.message || "Unknown error"}`);
    }

    return responseData.data;
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("An unexpected error occurred");
  }
};
