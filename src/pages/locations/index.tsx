import { useAuth, User } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from '@/components/datatable/app-data-table';
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from '@/components/datatable/app-data-table-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Model
export type Location = {
    id: string
    name: string
    latitude: string
    longtitude: string
    dataLog: DataLog[]
}

export type DataLog = { id: string, action: string, timestamp: string }

// Mock Data
export const data: Location[] = [
    {
        id: "728ed52f",
        name: "Informatics Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
            {
                id: "ps-002",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
            {
                id: "ps-003",
                action: "edit",
                timestamp: "2023-05-01 12:00:00",
            },
        ]
    },

    {
        id: "728efwefw",
        name: "Engineering Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-08-01 12:00:00",
            },
        ]
    },

    {
        id: "728ewewe",
        name: "Nursing Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
            {
                id: "ps-002",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

    {
        id: "232ed52f",
        name: "Business Factory",
        latitude: "12.434341",
        longtitude: "31.324234",
        dataLog: [
            {
                id: "ps-001",
                action: "create",
                timestamp: "2023-01-01 12:00:00",
            },
        ]
    },

]

// // Custom columns
export const columns: ColumnDef<Location>[] = [
    // Custom column for the name
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />;
        },
        cell: ({ row }) => {
            const name: string = row.getValue("name");
            return <div className="font-medium">{name}</div>;
        },
    },
    // Custom column for the latitude
    {
        accessorKey: "latitude",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Latitude" />;
        },
        cell: ({ row }) => {
            const latitude: string = row.getValue("latitude");

            return <div className="font-medium">{latitude}</div>;
        },
    },
    // Custom column for the longtitude
    {
        accessorKey: "longtitude",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Longtitude" />;
        },
        cell: ({ row }) => {
            const longtitude: string = row.getValue("longtitude");

            return <div className="font-medium">{longtitude}</div>;
        },
    },

    {
        accessorKey: "user",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="User" />;
        },
        cell: ({ row }) => {
            const id: string = row.original.dataLog[row.original.dataLog.length - 1].id;
            
            return <div className="font-medium">{id}</div>;
        },
    },

    {
        accessorKey: "updateAt",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Update At" />;
        },
        cell: ({ row }) => {
            const timestamp: string = row.original.dataLog[row.original.dataLog.length - 1].timestamp;
            const formatDate = new Date(timestamp).toLocaleString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            return <div className="font-medium">{formatDate}</div>;
        },
        sortUndefined: false,
    },
    // Custom column for the action
    {
        id: "actions",
        enableHiding: true,
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="" />;
        },
        cell: ({ row }) => {
            const location = row.original;

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
            );
        },
    },
];

export function AllLocationPage() {
    const { user } = useAuth() as { user: User };

    const [, setBreadcrumbs] = useBreadcrumb();

    const [locations, setLocations] = useState<Location[]>([]);

    const getLocations = () => {
        // fetch api locations format base on Model

        // Mock data will remove after api is ready
        setLocations(data)
    }

    useEffect(() => {
        getLocations();
        setBreadcrumbs([
            { name: "Locations" }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome, {user?.first_name} {user?.last_name}</h1>
            <DataTable columns={columns} data={locations} />
        </div>
    );
}