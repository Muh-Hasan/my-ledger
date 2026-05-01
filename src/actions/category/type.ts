import { z } from "zod";
import { CategorySchema, DeleteCategorySchema } from "./schema";

export type CategoryType = z.infer<typeof CategorySchema>;
export type DeleteCategoryType = z.infer<typeof DeleteCategorySchema>;