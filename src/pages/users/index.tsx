import { useAuth, User } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/datatable/app-data-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/datatable/app-data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { apiClient } from '@/services/api';
import { envConfig } from '@/config/envConfig';
import { API_ENDPOINTS } from '@/lib/constants';
import { useSearchParams } from 'react-router-dom';
import { updateSearchParams } from '@/utils/url.util';

// Model
export type UserModel = {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
};

// Custom columns
export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: 'index',
        header: ({ column }) => <DataTableColumnHeader column={column} title='No.' />,
        cell: ({ row }) => <div className='font-medium'>{row.index + 1}</div>
    },
    {
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.username}</div>
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.email}</div>
    },
    {
        accessorKey: 'first_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.first_name}</div>
    },
    {
        accessorKey: 'last_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.original.last_name}</div>
    },
    {
        id: 'actions',
        enableHiding: true,
        header: ({ column }) => <DataTableColumnHeader column={column} title='' />,
        cell: ({ row }) => {
            const user = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export function AllUserPage() {
    const { user } = useAuth() as { user: User };
    const [users, setUsers] = useState<UserModel[]>([]);
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

    const getUsers = async () => {
        try {
            const response = await apiClient.get(`${envConfig.apiUrl}${API_ENDPOINTS.USERS.BASE}?page=${currentPage}&pageSize=${itemsPerPage}&search=${search}`);
            const { data, meta } = response as any as { data: UserModel[]; meta: { total: number, totalPages: number } }
            setUsers(data);
            setTotal(meta.total); // อัปเดตจำนวนข้อมูลทั้งหมด ถ้าคุณมี state สำหรับ pagination
            setTotalPages(meta.totalPages);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const params = {
            page: currentPage.toString(),
            pageSize: itemsPerPage.toString(),
            ...(search ? { search: search.split(" ") } : {}),
        };

        updateSearchParams(setSearchParams, params);
        getUsers();
    }, [currentPage, itemsPerPage, search]);

    useEffect(() => {
        getUsers();
        setBreadcrumbs([{ name: 'Users' }]);
        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className='space-y-6'>
            <h1 className='text-xl font-bold'>All Users</h1>
            <p>User: {user?.username}</p>
            <DataTable
                columns={columns}
                data={users}
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
