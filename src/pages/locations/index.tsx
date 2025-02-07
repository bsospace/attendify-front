import { useAuth, User } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { useBreadcrumb } from '@/providers/breadcrumb-provider'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/datatable/app-data-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/datatable/app-data-table-header'
import { Link, useSearchParams } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ViewLocation } from './view'
import { apiClient } from '@/services/api'
import { envConfig } from '@/config/envConfig'
import { API_ENDPOINTS } from '@/lib/constants'
import { updateSearchParams } from '@/utils/url.util'

// Model
export type Location = {
  id: string
  name: string
  latitude: string
  longtitude: string
  dataLog: any[]
}

export type DataLog = { id: string; action: string; timestamp: string }

// Mock Data

// // Custom columns
export const columns: ColumnDef<Location>[] = [
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
      const name: string = row.getValue('name')
      return <div className='font-medium'>{name}</div>
    }
  },
  // Custom column for the latitude
  {
    accessorKey: 'latitude',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Latitude' />
    },
    cell: ({ row }) => {
      const latitude: string = row.getValue('latitude')

      return <div className='font-medium'>{latitude}</div>
    }
  },
  // Custom column for the longtitude
  {
    accessorKey: 'longitude',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Longtitude' />
    },
    cell: ({ row }) => {
      const longtitude: string = row.getValue('longitude')

      return <div className='font-medium'>{longtitude}</div>
    }
  },

  // Custom column for the action
  {
    id: 'actions',
    enableHiding: true,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='' />
    },
    cell: ({ row }) => {
      const location = row.original

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
              onClick={() => navigator.clipboard.writeText(location.id)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(location.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(location.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export function AllLocationPage() {
  const { user } = useAuth() as { user: User };

  const [, setBreadcrumbs] = useBreadcrumb()

  const [locations, setLocations] = useState<Location[]>([])
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

  const getLocations = async () => {
    try {
      const response = await apiClient.get(
        `${envConfig.apiUrl}${API_ENDPOINTS.LOCATIONS.BASE}?page=${currentPage}&pageSize=${itemsPerPage}&search=${search}`
      )

      const { data, meta } = response as any as { data: Location[]; meta: { total: number, totalPages: number } }
      
      setLocations(data)
      setTotal(meta.total) // อัปเดตจำนวนข้อมูลทั้งหมด ถ้าคุณมี state สำหรับ pagination
      setTotalPages(meta.totalPages)
    } catch (e) {
      console.error(e)
    }
  }

  // Update search params when the page changes
  useEffect(() => {
    const params = {
      page: currentPage.toString(),
      pageSize: itemsPerPage.toString(),
      ...(search ? { search: search.split(" ") } : {}),
    };
    
    updateSearchParams(setSearchParams, params);
    getLocations();
  }, [currentPage, itemsPerPage, search]);

  useEffect(() => {
    getLocations()
    setBreadcrumbs([{ name: 'Locations' }])

    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  return (
    <div className='space-y-6'>
      <div className=' flex justify-between'>
        <h1 className='text-3xl font-bold'>
          Welcome, {user?.username}!
        </h1>
        <ViewLocation />
      </div>
      <DataTable columns={columns} data={locations} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setSearchParams={setSearchParams} updateSearchParams={updateSearchParams} total={total} totalPages={totalPages} />
    </div>
  )
}