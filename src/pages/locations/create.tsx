import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';

export function CreateLocationPage() {
    const { user } = useAuth();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Location", href: "/locations" },
        { name: "Create" }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is create location page
        </div>
    );
}