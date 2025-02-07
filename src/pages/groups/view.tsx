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
import { apiClient } from '@/services/api'
import { envConfig } from '@/config/envConfig'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import { useParams, useSearchParams } from 'react-router-dom'
import { NotFoundPage } from '../not-found'
import { AxiosError } from 'axios'
import { updateSearchParams } from '@/utils/url.util'

type UsersGroup = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

// // Custom columns
export const columns: ColumnDef<UsersGroup>[] = [
    // Custom column for the name
    {
        accessorKey: 'index', // You can use an arbitrary name
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='No.' />
        ),
        cell: ({ row }) => {
            return <div className='font-medium'>{row.index + 1}</div>
        }
    },
    {
        accessorKey: 'username',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title='Username' />
        },
        cell: ({ row }) => {
            return <div className='font-medium'>{row.original.username}</div>
        }
    },
    // Custom column for the first name
    {
        accessorKey: 'first_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title='First Name' />
        },
        cell: ({ row }) => {
            return <div className='font-medium'>{row.original.first_name}</div>
        }
    },
    // Custom column for the last name
    {
        accessorKey: 'last_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title='Last Name' />
        },
        cell: ({ row }) => {
            return <div className='font-medium'>{row.original.last_name}</div>
        }
    },
    // Custom column for the email
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title='Email' />
        },
        cell: ({ row }) => {
            return <div className='font-medium'>{row.original.email}</div>
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
                            onClick={() => navigator.clipboard.writeText(group.id)}
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

export function GroupPage() {
    const { user } = useAuth() as { user: User };
    const { id } = useParams();
    const [usersGroup, setUsersGroup] = useState<UsersGroup[]>([]);
    const [notFound, setNotFound] = useState(false);

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

    const getUsersGroup = async () => {
        try {
            const response = await apiClient.get(
                `${envConfig.apiUrl}${API_ENDPOINTS.USERS.BASE}/${id}/get-by-group?pageSize=${itemsPerPage}&page=${currentPage}&search=${search}`
            )
            const { data, meta } = response as any as { data: UsersGroup[]; meta: { total: number, totalPages: number } }

            setUsersGroup(data)
            setTotal(meta.total); // อัปเดตจำนวนข้อมูลทั้งหมด ถ้าคุณมี state สำหรับ pagination
            setTotalPages(meta.totalPages);
        } catch (e: unknown) {
            console.error(e)
            if (e instanceof AxiosError && e.response?.status == 404) {
                setNotFound(true)
                console.error('Group not found')
            }
        }
    }

    useEffect(() => {
        const params = {
          page: currentPage.toString(),
          pageSize: itemsPerPage.toString(),
          ...(search ? { search: search.split(" ") } : {}),
        };
        
        updateSearchParams(setSearchParams, params);
        getUsersGroup();
      }, [currentPage, itemsPerPage, search]);

    useEffect(() => {
        const params = {
            page: currentPage.toString(),
            pageSize: itemsPerPage.toString(),
            ...(search ? { search: search.split(" ") } : {}),
        };

        updateSearchParams(setSearchParams, params);
        getUsersGroup();
        setBreadcrumbs([
            { name: "Group", href: "/groups" },
            { name: `${id}` }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    if (notFound) {
        return <NotFoundPage />;
    }

    return (
        <div className="space-y-6">
            this is the view group page
            id: {id}
            user: {user?.username}
            <DataTable
                columns={columns}
                data={usersGroup}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                total={total}
                totalPages={totalPages}
                setSearchParams={setSearchParams}
                updateSearchParams={updateSearchParams}
                searchParams={searchParams}
            />
        </div>
    );
}