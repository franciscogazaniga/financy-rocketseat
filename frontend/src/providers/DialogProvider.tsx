import { createContext, useContext, useState } from "react"
import type { Category, Transaction } from "@/types"
import { UpdateTransactionDialog } from "@/pages/Transactions/components/UpdateTransactionDialog";
import { CreateTransactionDialog } from "@/pages/Transactions/components/CreateTransactionDialog";
import { DeleteTransactionDialog } from "@/pages/Transactions/components/DeleteTransactionDialog";
import { CreateCategoryDialog } from "@/pages/Categories/components/CreateCategoryDialog";
import { UpdateCategoryDialog } from "@/pages/Categories/components/UpdateCategoryDialog";
import { DeleteCategoryDialog } from "@/pages/Categories/components/DeleteCategoryDialog";

type DialogType =
  | { type: "updateTransaction"; data: { transaction: Transaction } }
  | { type: "deleteTransaction"; data: { transaction: Transaction } }
  | { type: "createTransaction" }
  | { type: "createCategory" }
  | { type: "updateCategory"; data: { category: Category } }
  | { type: "deleteCategory"; data: { category: Category } }
  | null

interface DialogContextType {
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void
}

// const DialogContext = createContext({} as DialogContextType)
const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogType>(null)

  function openDialog(dialog: DialogType) {
    setDialog(dialog)
  }

  function closeDialog() {
    setDialog(null)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      {dialog?.type === "updateTransaction" && (
        <UpdateTransactionDialog
          key={`${dialog.type}-${dialog.data.transaction.id}`}
          open
          onOpenChange={closeDialog}
          transaction={dialog.data.transaction}
        />
      )}

      {dialog?.type === "createTransaction" && (
        <CreateTransactionDialog
          open
          onOpenChange={closeDialog}
        />
      )}

      {dialog?.type === "deleteTransaction" && (
        <DeleteTransactionDialog
          open
          onOpenChange={closeDialog}
          transaction={dialog.data.transaction}
        />
      )}

      {dialog?.type === "createCategory" && (
        <CreateCategoryDialog
          open
          onOpenChange={closeDialog}
        />
      )}

      {dialog?.type === "updateCategory" && (
        <UpdateCategoryDialog
          open
          onOpenChange={closeDialog}
          category={dialog.data.category}
        />
      )}

      {dialog?.type === "deleteCategory" && (
        <DeleteCategoryDialog
          open
          onOpenChange={closeDialog}
          category={dialog.data.category}
        />
      )}

    </DialogContext.Provider>
  )
}

// export function useDialog() {
//   return useContext(DialogContext)
// }

export function useDialog() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error("useDialog must be used within DialogProvider")
  }

  return context
}