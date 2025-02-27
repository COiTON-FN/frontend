import { z } from "zod";

export const listPropertyFormSchema = z.object({});

export type Type_ListPropertyFormSchema = z.infer<
  typeof listPropertyFormSchema
>;
