"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sortable,
  SortableContent,
  SortableItem,
} from "@/components/ui/sortable";
import { AppTestimony } from "@prisma/client";
import { createTestimonyColumns } from "./testimony-columns";
import { updateTestimonyOrder } from "../lib/testimony-actions";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";

interface TestimonyTableProps {
  initialData: AppTestimony[];
}

export function TestimonyTable({ initialData }: TestimonyTableProps) {
  const [data, setData] = React.useState(initialData);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = React.useMemo(
    () => createTestimonyColumns(isDeleting, setIsDeleting),
    [isDeleting],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  });

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(
        (item) => item.id.toString() === active.id,
      );
      const newIndex = data.findIndex((item) => item.id.toString() === over.id);

      const newData = arrayMove(data, oldIndex, newIndex);

      // Update order field based on new index
      const updatedData = newData.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setData(updatedData);
      setIsUpdating(true);

      const res = await updateTestimonyOrder(
        updatedData.map((item) => ({ id: item.id, order: item.order })),
      );

      if (!res.success) {
        toast.error(res.error || "Gagal memperbarui urutan");
        setData(data); // Revert on failure
      } else {
        toast.success("Urutan testimoni diperbarui");
      }
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-md border">
      <Sortable
        value={data.map((item) => item.id.toString())}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContent withoutSlot>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <SortableItem key={row.id} value={row.id} asChild>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        isUpdating ? "opacity-50 pointer-events-none" : ""
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </SortableItem>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada testimoni.
                  </TableCell>
                </TableRow>
              )}
            </SortableContent>
          </TableBody>
        </Table>
      </Sortable>
    </div>
  );
}
