import { useAuth, User } from '@/hooks/useAuth'
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
import { ViewLocation } from './view'
import { apiClient } from '@/services/api'
import { envConfig } from '@/config/envConfig'
import { API_ENDPOINTS } from '@/lib/constants'

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

export function AllLocationPage () {
  const { user } = useAuth() as { user: User };

  const [, setBreadcrumbs] = useBreadcrumb()

  const [locations, setLocations] = useState<Location[]>([])

  const getLocations = async () => {
    try {
      const response = await apiClient.get(
        `${envConfig.apiUrl}${API_ENDPOINTS.LOCATIONS.BASE}`
      )
      const data = response.data as Location[]
      setLocations(data)
    } catch (e) {
      console.error(e)
    }
  }

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
      <DataTable columns={columns} data={locations} />
    </div>
  )
}