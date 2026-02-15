import type { Transaction } from "@/types"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"

export function TransactionTable({ data }: any) {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "date",
      header: "Data",
    },
    {
      accessorKey: "category",
      header: "Categoria",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.value)
      },
    },
    {
      accessorKey: "actions",
      header: "Ações",
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
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
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}