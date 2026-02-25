import type { User } from "@/types";

export const mockUser: User = {
  id: "mock-user-id",
  name: "Usuário Mock",
  email: "mock@fake.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const mockGetUser: {
  getUser: User
} = {
  getUser: 
    {
      id: "mock-user-id",
      name: "Usuário Mock",
      email: "mock@fake.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
}