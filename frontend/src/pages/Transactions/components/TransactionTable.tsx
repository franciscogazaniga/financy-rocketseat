import { getCategoryColor } from "@/lib/colors-registry"
import { getCategoryIcon } from "@/lib/icons-registry"
import type { Transaction } from "@/types"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, CircleArrowDown, CircleArrowUp, SquarePen, Trash } from "lucide-react"
import { useDialog } from "@/providers/DialogProvider"
import { formatCurrencyFromString } from "@/utils/formatCurrency"

export function TransactionTable({
    data,
    total,
    totalPages,
    pagination,
    onPaginationChange
  }: any) {
  const { openDialog } = useDialog()

  function getPaginationRange(total: number, page: number, pageSize: number) {
    if (total === 0) {
      return { start: 0, end: 0 }
    }

    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)

    return { start, end }
  }
  const { start, end } = getPaginationRange(total, pagination.pageIndex + 1, pagination.pageSize)

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => {
        const description = row.original.description
        const categoryIcon = row.original.category?.icon
        const categoryColor = row.original.category?.color

        const Icon = getCategoryIcon(categoryIcon)
        const color = getCategoryColor(categoryColor)

        return (
          <div className={`flex flex-row items-center text-title-primary text-sm gap-4`}>
            <div className={`p-3 rounded-[8px] ${color.bg}`}>
              <Icon className={`w-4 h-4 ${color.text}`} />
            </div>
            { description }
          </div>
        )
      }
    },
    {
      accessorKey: "date",
      header: "Data",
      cell: ({ row }) => {
        const date = new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(row.original.date))

        return (
          <div className="text-sm">
            { date }
          </div>
        )
      }
    },
    {
      header: "Categoria",
      cell: ({ row }) => {
        const category = row.original.category?.title
        const categoryColor = row.original.category?.color

        const color = getCategoryColor(categoryColor)

        return (
          <div className={`w-fit rounded-full text-sm px-3 py-1 ${color.text} ${color.bg}`}>
            { category }
          </div>
        )
      }
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.original.type

        return (
          <div className="flex items-center gap-2">
            {type === "INCOME" ? (
              <>
                <CircleArrowUp className="h-4 w-4 text-success" />
                <span className="text-green-base text-sm">
                  Entrada
                </span>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-4 w-4 text-danger" />
                <span className="text-red-base text-sm">
                  Saída
                </span>
              </>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: "value",
      header: "Valor",
      cell: ({ row }) => {
        const value = formatCurrencyFromString(row.original.value.toString())

        const type = row.original.type

        return (
          <div className="text-title-primary text-sm">
            {type === "INCOME" ? "+" : "-"} { value }
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-2">
            <button 
              className="p-2 border bg-white rounded-[8px] hover:bg-border"
              onClick={() => {
                openDialog({
                  type: "deleteTransaction",
                  data: { transaction: row.original }
                })
              }}
            >
              <Trash className="w-4 h-4 text-danger"/>
            </button>
            <button
              className="p-2 border bg-white rounded-[8px] hover:bg-border"
              onClick={() => {
                openDialog({
                  type: "updateTransaction",
                  data: { transaction: row.original }
                })
              }}
            >
              <SquarePen className="w-4 h-4 text-gray-700"/>
            </button>
          </div>
        )
      }
    },
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination
    },
    onPaginationChange,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
    <table className="w-full">
      <thead className="text-left text-title-secondary uppercase text-xs">
        {table.getHeaderGroups().map(headerGroup => (
          <tr
            key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th className="px-6 pb-5 border-b border-border"
                key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        { table.getRowModel().rows.length === 0 ? (
          <tr>
            <td
              colSpan={table.getAllColumns().length}
              className="text-center py-10 border-b border-border text-foreground text-sm"
            >
              Nenhuma transação encontrada
            </td>
          </tr>
        ) : (
        table.getRowModel().rows.map(row => (
          <tr 
            className="hover:bg-gray-100"
            key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td className="px-6 py-5 border-b border-border"
                key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))
      )
      }
      </tbody>
    </table>

    <div className="flex flex-row items-center justify-between gap-2 p-4">
      <div>
        <span>{start} a {end} | {total} resultados</span>
      </div>

      <div className="flex flex-row gap-2">
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-border p-2 rounded-[8px] disabled:text-gray-300 disabled:border-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex flex-row gap-2">
          {table.getPageOptions().map(p => (
            <button
              key={p}
              onClick={() => table.setPageIndex(p)}
              className={`${(p === pagination.pageIndex ? "bg-brand-base text-white hover:bg-brand-dark" : "bg-white hover:bg-border")} w-9 h-9 shrink-0 flex items-center justify-center border border-border p-2 rounded-[8px]`}
            >
              {p + 1}
            </button>
          ))}
        </div>


        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="w-9 h-9 shrink-0 flex items-center justify-center bg-white border border-border p-2 rounded-[8px] disabled:text-gray-300 disabled:border-gray-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
    </>
  )
}