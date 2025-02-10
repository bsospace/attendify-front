"use client"
import {
    ColumnDef,
    getFilteredRowModel,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    VisibilityState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import * as React from "react"
import { DataTablePagination } from "./app-data-table-pagination";
import { DataTableViewOptions } from "./app-data-table-column-toggle"
import { SetURLSearchParams, URLSearchParamsInit } from "react-router-dom"

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (size: number) => void;
    setSearchParams: SetURLSearchParams
    updateSearchParams: (setSearchParams: SetURLSearchParams,
        params: URLSearchParamsInit) => void;
    total: number;
    totalPages: number;
    searchParams: URLSearchParamsInit;
}


export function DataTable<TData extends { id: string; }, TValue>({
    columns,
    data,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    setSearchParams,
    updateSearchParams,
    total,
    totalPages,
    searchParams,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="rounded-md border">
            {/* {Table Header} */}
            <div className="flex items-center p-4">
                <Input
                    placeholder="Filter..."
                    defaultValue={new URLSearchParams(searchParams as Record<string, string>).get("search") || ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        table.setGlobalFilter(value);
                        const params = new URLSearchParams();
                        params.set("search", value);
                        setSearchParams(params);
                    }}
                    className="max-w-sm"
                />
                <DataTableViewOptions table={table} />
            </div>
            {/* Table Body */}
            <div className="rounded-md border mx-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-gray-100 group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Table Footer */}
            <div className="p-4">
                <DataTablePagination
                    table={table}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    updateSearchParams={updateSearchParams} 
                    setSearchParams={setSearchParams}
                    total={total}
                    totalPages={totalPages}/>
            </div>
        </div>
    )
}
