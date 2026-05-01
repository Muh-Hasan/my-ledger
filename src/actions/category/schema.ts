import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["inflow", "expense"], {
    error: "Category type must be either 'inflow' or 'expense'",
  }),
});

export const DeleteCategorySchema = z.object({
  id: z.number().int().positive("Category ID must be a number"),
});
