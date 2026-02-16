import { createContext, useContext, useState } from "react"
import type { Transaction } from "@/types"
import { UpdateTransactionDialog } from "@/pages/Transactions/components/UpdateTransactionDialog";
import { CreateTransactionDialog } from "@/pages/Transactions/components/CreateTransactionDialog";
import { DeleteTransactionDialog } from "@/pages/Transactions/components/DeleteTransactionDialog";

type DialogType =
  | { type: "updateTransaction"; data: { transaction: Transaction } }
  | { type: "deleteTransaction"; data: { transaction: Transaction } }
  | { type: "createTransaction" }
  | null

interface DialogContextType {
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void
}

const DialogContext = createContext({} as DialogContextType)

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

    </DialogContext.Provider>
  )
}

export function useDialog() {
  return useContext(DialogContext)
}