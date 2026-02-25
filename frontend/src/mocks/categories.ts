import type { Category, CategoryWithStats } from "@/types";
import { mockUser } from "./user";

function generateMockCategories(): Category[] {
  const baseCategories = [
    { title: "Assinaturas", icon: "receipt-text", color: "blue" },
    { title: "Alimentação", icon: "utensils", color: "green" },
    { title: "Transporte", icon: "car-front", color: "yellow" },
    { title: "Moradia", icon: "house", color: "purple" },
    { title: "Lazer", icon: "smile", color: "pink" },
    { title: "Saúde", icon: "heart-pulse", color: "red" },
    { title: "Educação", icon: "book-open", color: "blue" },
    { title: "Investimentos", icon: "briefcase-business", color: "green" },
    { title: "Compras", icon: "shopping-cart", color: "orange" },
    { title: "Outros", icon: "gift", color: "yellow" },
  ] as const

  return baseCategories.map((cat, index) => ({
    id: (index + 1).toString(),
    title: cat.title,
    description: `Gastos relacionados a ${cat.title.toLowerCase()}.`,
    icon: cat.icon,
    color: cat.color,
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export const mockCategories: Category[] = generateMockCategories();

export const mockCategoriesWithStats: {
  listCategoriesWithStats: CategoryWithStats[];
} = {
  listCategoriesWithStats: mockCategories.map((category) => ({
    ...category,
    transactionsCount: Math.floor(Math.random() * 15) + 1,
    totalValue: (Math.floor(Math.random() * 500) + 1) * 100,
  })),
};

export const mockGetCategories: {
  getCategories: Category[];
} = {
  getCategories: mockCategories,
};