import { useAuth, User } from '@/hooks/useAuth';
import { GroupDialog } from './dialog';
import { useEffect, useState } from 'react'
import { useBreadcrumb } from '@/providers/breadcrumb-provider'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/datatable/app-data-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/datatable/app-data-table-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { apiClient } from '@/services/api'
import { envConfig } from '@/config/envConfig'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updateSearchParams } from '@/utils/url.util'
import { formatDate } from '@/utils/date.util'

// Model
export type Group = {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}


// Custom columns
export const columns: ColumnDef<Group>[] = [
  // Custom column for the name
  {
    accessorKey: 'index', // You can use an arbitrary name
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No.' />
    ),
    cell: ({ row }) => {
      const index = row.index + 1 // Add 1 to make the index start from 1
      return <div className='font-medium'>{index}</div>
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Name' />
    },
    cell: ({ row }) => {
      // const name: string = row.getValue('name')
      return <div className='font-medium'>{row.original.name}</div>
    },
    filterFn: 'includesString'
  },
  // Custom column for the latitude
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Description' />
    },
    cell: ({ row }) => {
      return <div className='font-medium'>{row.original.description}</div>
    },
    filterFn: 'includesString'
  },
  // Custom column for the Created At
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Created At' />
    },
    cell: ({ row }) => {

      return <div className='font-medium'>{formatDate(row.original.created_at)}</div>
    },
    filterFn: 'includesString'
  },
  // Custom column for the Updated At
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Updated At' />
    },
    cell: ({ row }) => {

      return <div className='font-medium'>{formatDate(row.original.updated_at)}</div>
    },
    filterFn: 'includesString'
  },
  // Custom column for the action
  {
    id: 'actions',
    enableHiding: true,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='' />
    },
    cell: ({ row }) => {
      const group = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => window.location.href = `${ROUTES.GROUP.VIEW.replace(':id', group.name)}`}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(group.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(group.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export function AllGroupPage() {

  const { user } = useAuth() as { user: User };
  const [groups, setGroups] = useState<Group[]>([]);

  const [, setBreadcrumbs] = useBreadcrumb();
  const [searchParams, setSearchParams] = useSearchParams();

  // currentPage is the current page number
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // itemsPerPage is the number of items per page
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("pageSize")) || 10
  );

  // total is the total number of items
  const [total, setTotal] = useState(0);

  // totalPages is the total number of pages
  const [totalPages, setTotalPages] = useState(1);

  // search is the search search
  const search = searchParams.get("search") || "";

  const getGroup = async () => {
    try {
      const response = await apiClient.get(
        `${envConfig.apiUrl}${API_ENDPOINTS.GROUPS.BASE}?page=${currentPage}&pageSize=${itemsPerPage}&search=${search}`
      )
      const { data, meta } = response as any as { data: Group[]; meta: { total: number, totalPages: number } }
      setGroups(data);
      setTotal(meta.total); // อัปเดตจำนวนข้อมูลทั้งหมด ถ้าคุณมี state สำหรับ pagination
      setTotalPages(meta.totalPages);
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const params = {
      page: currentPage.toString(),
      pageSize: itemsPerPage.toString(),
      ...(search ? { search: search.split(" ") } : {}),
    };

    updateSearchParams(setSearchParams, params);
    getGroup();
  }, [currentPage, itemsPerPage, search]);

  useEffect(() => {
    getGroup();
    setBreadcrumbs([
      { name: "Groups" }
    ]);

    return () => setBreadcrumbs(null);
  }, [setBreadcrumbs]);

  return (
    <div className="space-y-6">
      this is the view all groups page
      user: {user?.username}
      <GroupDialog />
      <DataTable
        columns={columns}
        data={groups}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        total={total}
        totalPages={totalPages}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        updateSearchParams={updateSearchParams}
      />
    </div>
  );
}