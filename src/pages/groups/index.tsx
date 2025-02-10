import { User } from "@/hooks/useAuth";
import { CreateGroupDialog } from "./create";
import { EditGroupDialog } from "./edit";
import { AddMemberDialog } from "./addMember";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/providers/breadcrumb-provider";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable/app-data-table";
import { 
    MoreHorizontal, 
    Pencil,
    UserPlus,
    Book,
    Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/app-data-table-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/services/api";
import { envConfig } from "@/config/envConfig";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";
import { updateSearchParams } from "@/utils/url.util";
import { formatDate } from "@/utils/date.util";
import { toast } from "sonner";

// Model
export type Group = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    members: User[];
};

// Custom columns
export const columns = (
    onEdit: (group: Group) => void,
    onAddMember: (group: Group) => void,
    onDelete: (group: Group) => void
): ColumnDef<Group>[] => [
    {
        accessorKey: "index",
        header: ({ column }) => <DataTableColumnHeader column={column} title="No." />,
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
            <div
                className="font-medium cursor-pointer hover:underline"
                onClick={() => window.location.href = `${ROUTES.GROUP.VIEW.replace(":id", row.original.name)}`}
            >
                {row.original.name}
            </div>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => <div className="font-medium">{row.original.description}</div>,
        filterFn: "includesString",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => <div className="font-medium">{formatDate(row.original.created_at)}</div>,
        filterFn: "includesString",
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
        cell: ({ row }) => <div className="font-medium">{formatDate(row.original.updated_at)}</div>,
        filterFn: "includesString",
    },
    {
        id: "actions",
        enableHiding: true,
        header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
        cell: ({ row }) => {
            const group = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                            className="cursor-pointer" 
                            onClick={() => window.location.href = `${ROUTES.GROUP.VIEW.replace(":id", group.name)}`}
                        >
                            <Book className="w-4 h-4 mr-2" />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(group)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onAddMember(group)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(group)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export function AllGroupPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [, setBreadcrumbs] = useBreadcrumb();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get("pageSize")) || 10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const search = searchParams.get("search") || "";

    const getGroup = async () => {
        try {
            const response = await apiClient.get(`${envConfig.apiUrl}${API_ENDPOINTS.GROUPS.BASE}?page=${currentPage}&pageSize=${itemsPerPage}&search=${search}`);
            const { data, meta } = response as unknown as { data: Group[]; meta: { total: number; totalPages: number } };
            setGroups(data);
            setTotal(meta.total);
            setTotalPages(meta.totalPages);
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    const onDelete = async (group: Group) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this group?");
            if (!confirmDelete) return;

            await apiClient.delete(`${API_ENDPOINTS.GROUPS.BASE}/${group.id}/delete`, null);
            setGroups((prev) => prev.filter((g) => g.id !== group.id));
        } catch (error) {
            if (error instanceof Error && (error as { details?: { message?: string } }).details?.message) {
                toast.error((error as unknown as { details: { message: string } }).details.message);
            } else {
                toast.error("An unknown error occurred");
            }
        }
    }

    useEffect(() => {
        updateSearchParams(setSearchParams, { page: currentPage.toString(), pageSize: itemsPerPage.toString() });
        getGroup();
    }, [currentPage, itemsPerPage, search]);

    useEffect(() => {
        getGroup();
        setBreadcrumbs([{ name: "Groups" }]);
        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">All Groups</h1>
                <CreateGroupDialog />
            </div>

            <DataTable
                columns={columns(
                    (group) => {
                        setSelectedGroup(group);
                        setIsEditOpen(true);
                    },
                    (group) => {
                        setSelectedGroup(group);
                        setIsAddMemberOpen(true);
                    },
                    (group) => {
                        onDelete(group);
                    }
                )}
                data={groups}
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

            {selectedGroup && (
                <EditGroupDialog
                    existingGroup={selectedGroup}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                />
            )}

            {selectedGroup && (
                <AddMemberDialog
                    id={selectedGroup.id}
                    existingUsers={selectedGroup.members || []}
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    onUpdateUsers={(users) => {
                        setSelectedGroup((prev) => prev ? { ...prev, members: users } : prev);
                    }}
                />
            )}

        </div>
    );
}
