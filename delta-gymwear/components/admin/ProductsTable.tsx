"use client";

import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";

export interface ProductRow {
  id: string;
  name: string;
  category: string;
  status: string;
  price: number | null;
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<ProductRow>[]>(
    () => [
      { accessorKey: "name", header: "Product" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "price",
        header: "From",
        cell: ({ row }) => (row.original.price === null ? "-" : formatPrice(row.original.price)),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link className="font-bold underline" href={`/admin/products/${row.original.id}`}>
            Edit
          </Link>
        ),
      },
    ],
    [],
  );

  // TanStack Table intentionally returns non-memoizable helpers; this isolated admin table owns that state.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3">
                  <button
                    type="button"
                    className="font-black uppercase"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
