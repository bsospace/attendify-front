import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetURLSearchParams, URLSearchParamsInit } from "react-router-dom";
import { useEffect } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  setSearchParams: SetURLSearchParams;
  updateSearchParams: (setSearchParams: SetURLSearchParams, params: URLSearchParamsInit) => void;
  total: number;
  totalPages: number;
}

export function DataTablePagination<TData>({
  table,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setSearchParams,
  updateSearchParams,
  total,
  totalPages,
}: DataTablePaginationProps<TData>) {
  
  // อัปเดต URL params เมื่อ currentPage หรือ itemsPerPage เปลี่ยน
  useEffect(() => {
    updateSearchParams(setSearchParams, {
      page: currentPage.toString(),
      pageSize: itemsPerPage.toString(),
    });

    table.setPageIndex(currentPage - 1);
    table.setPageSize(itemsPerPage);
  }, [currentPage, itemsPerPage, setSearchParams, updateSearchParams, table]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
      {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, total)} of {total} row(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => {
              const newSize = Number(value);
              setItemsPerPage(newSize);
              setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนจำนวนแถว
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
