import { Slash } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbData {
    name: string;
    href?: string; // Optional: Allows for breadcrumb links
}

interface AppBreadcrumbProps {
    items: BreadcrumbData[]; // Accepts an array of breadcrumb data
}

export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
    return (
        <Breadcrumb>
        <BreadcrumbList>
            {items.map((item, index) => (
            <BreadcrumbItem key={index}>
                {item.href ? (
                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                ) : (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
                {/* Add a separator after each item except the last */}
                {index < items.length - 1 && (
                <BreadcrumbSeparator>
                    <Slash />
                </BreadcrumbSeparator>
                )}
            </BreadcrumbItem>
            ))}
        </BreadcrumbList>
        </Breadcrumb>
    );
}