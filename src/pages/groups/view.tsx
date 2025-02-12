import { useEffect, useState } from 'react'
import { User } from '@/hooks/useAuth'
import { ColumnDef } from '@tanstack/react-table'
import { useBreadcrumb } from '@/providers/breadcrumb-provider'
import { DataTable } from '@/components/datatable/app-data-table'
import { Trash, UserPlus } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/datatable/app-data-table-header'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from '@/components/ui/checkbox'
import { apiClient } from '@/services/api'
import { API_ENDPOINTS } from '@/lib/constants'
import { useParams, useSearchParams } from 'react-router-dom'
import { updateSearchParams } from '@/utils/url.util'
import { formatPastDate } from '@/utils/date.util'
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AddMemberDialog } from './addMember'

type UsersGroup = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

type Group = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const columns = (setIsConfirmOpenOne: (isConfirmOpenOne: boolean) => void, selectedUsers: string[], setSelectedUsers: (users: string[]) => void): ColumnDef<UsersGroup>[] => [
    // Custom column for the name
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={selectedUsers.length > 0 && selectedUsers.length === table.getRowModel().rows.length}
                onCheckedChange={(value) => {
                    if (value) {
                        const allIds = table.getRowModel().rows.map((row) => row.original.id);
                        setSelectedUsers(allIds.map((id) => id));
                    } else {
                        setSelectedUsers([]);
                    }
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={selectedUsers.includes(row.original.id)}
                onCheckedChange={() => {
                    setSelectedUsers(
                        selectedUsers.includes(row.original.id)
                            ? selectedUsers.filter((id) => id !== row.original.id)
                            : [...selectedUsers, row.original.id]
                    );
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        },
    {
        accessorKey: 'index',
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
        accessorKey: 'first name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title='First Name' />
        },
        cell: ({ row }) => {
            return <div className='font-medium'>{row.original.first_name}</div>
        }
    },
    // Custom column for the last name
    {
        accessorKey: 'last name',
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
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Trash
                                className="cursor-pointer h-4 w-4"
                                onClick={() => {
                                    setSelectedUsers([row.original.id]);
                                    setIsConfirmOpenOne(true);
                                }
                                }
                            />
                        </TooltipTrigger>
                        <TooltipContent>Delete User</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    }
]

export function GroupPage() {
    const { id } = useParams();
    const [usersGroup, setUsersGroup] = useState<UsersGroup[]>([]);
    const [group, setGroup] = useState<Group>();
    const [, setBreadcrumbs] = useBreadcrumb();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isConfirmOpenMany, setIsConfirmOpenMany] = useState(false);
    const [isConfirmOpenOne, setIsConfirmOpenOne] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

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
                `${API_ENDPOINTS.USERS.BASE}/${id}/get-by-group?pageSize=${itemsPerPage}&page=${currentPage}&search=${search}`
            )
            const { data, meta } = response as unknown as { 
                data: { users: UsersGroup[], group: Group }; 
                meta: { total: number; totalPages: number } 
            };

            setUsersGroup(data.users);
            setGroup(data.group);
            setTotal(meta.total);
            setTotalPages(meta.totalPages);

            console.log(group);
            console.log(usersGroup);
            
            
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
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

    const deleteUser = async (userId: string) => {
        try {
            await apiClient.delete(`group/group-user/${group?.id}/delete`, {
                data: { users: [{ id: userId }] },
            }
            );
            toast.success("User removed successfully.");
            setSelectedUsers([]);
            getUsersGroup();
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
        setIsConfirmOpenOne(false);
    }

    const deleteSelectedUsers = async () => {
        if (selectedUsers.length === 0) {
            toast.error("No users selected for deletion.");
            return;
        }

        try {
            await apiClient.delete(`group/group-user/${group?.id}/delete`, {
                data: { users: selectedUsers.map((id) => ({ id })) },
            });
            toast.success(`${selectedUsers.length} users removed successfully.`);
            setSelectedUsers([]);
            getUsersGroup();
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
        setIsConfirmOpenMany(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Group: {id}</h2>

                <p className="text-gray-700">{group?.description || "No description available."}</p>

                {/* Show "Latest Update" by default */}
                <div className="group relative">
                    <p className="text-gray-600">
                        <span className="font-semibold">Latest Update:</span> {group?.updated_at ? formatPastDate(group.updated_at) : "N/A"}
                    </p>

                    {/* Show "Created At" only on hover */}
                    <div className="absolute bg-gray-800 text-white text-sm p-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 left-0 mt-1">
                        <p><span className="font-semibold">Created At:</span> {group?.created_at ? formatPastDate(group.created_at) : "N/A"}</p>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                {/* Table Title */}
                <div className="flex justify-between items-center h-12">
                    <h2 className="text-xl font-semibold text-gray-900">Group Members</h2>
                    <div>
                        {selectedUsers.length > 0 && (
                            <Button className="mr-2" variant="destructive" onClick={() => setIsConfirmOpenMany(true)}>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete {selectedUsers.length} Selected
                            </Button>
                        )}
                        <Button onClick={() => setIsAddMemberOpen(true)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                        </Button>
                    </div>
                </div>

                {/* DataTable */}
                <DataTable
                    columns={columns(setIsConfirmOpenOne, selectedUsers, setSelectedUsers)}
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

            {/* Confirmation Delete Many */}
            <Dialog open={isConfirmOpenMany} onOpenChange={setIsConfirmOpenMany}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove <strong>{selectedUsers.length} users</strong> from this group?
                        This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmOpenMany(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteSelectedUsers}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Delete One */}
            <Dialog open={isConfirmOpenOne} onOpenChange={setIsConfirmOpenOne}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700">
                        Are you sure you want to remove this user from this group?
                        This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmOpenOne(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => deleteUser(selectedUsers[0])}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Member */}
            <AddMemberDialog
                id={group?.id || ""}
                existingUsers={usersGroup as User[] || []}
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onUpdateUsers={(users) => {
                    setUsersGroup(users);
                }}
            />

        </div>
    );
}