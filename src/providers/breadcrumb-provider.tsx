import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbData {
    name: string;
    href?: string;
}

type BreadcrumbContextType = [
    BreadcrumbData[] | null,
    React.Dispatch<React.SetStateAction<BreadcrumbData[] | null>>
];

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
    }
    return context;
};

interface BreadcrumbProviderProps {
    children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbData[] | null>([]);

    return (
        <BreadcrumbContext.Provider value={[breadcrumbs, setBreadcrumbs]}>
        {children}
        </BreadcrumbContext.Provider>
    );
}