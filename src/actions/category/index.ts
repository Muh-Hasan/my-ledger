'use server'
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema";
import { CategoryType, DeleteCategoryType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { CategorySchema, DeleteCategorySchema } from "./schema";

const createCategoryHandler = async (data: CategoryType) => {
  try {
    const newCategory = await db.insert(categories).values(data).returning();
    return { data: { category: newCategory } };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during category creation",
    };
  }
};

const deleteCategoryHandler = async (data: DeleteCategoryType) => {
  try {
    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, data.id))
      .returning();

    return { data: { category: deletedCategory } };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during category deletion",
    };
  }
};

export const createCategory = createSafeAction(
  CategorySchema,
  createCategoryHandler,
);
export const deleteCategory = createSafeAction(
  DeleteCategorySchema,
  deleteCategoryHandler,
);
