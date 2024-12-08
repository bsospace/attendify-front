import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { useParams } from 'react-router-dom';

export function LocationPage() {
    const { user } = useAuth();
    const { id } = useParams();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Location", href: "/locations" },
        { name: id }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is the view location page
        id: {id}
        </div>
    );
}