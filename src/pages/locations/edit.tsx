import { useAuth, User } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { useParams } from 'react-router-dom';

export function EditLocationPage() {
    const { user } = useAuth() as { user: User };
    const { id } = useParams();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Location", href: "/locations" },
        { name: `Edit ${id}` }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is edit location page
        id: {id}
        user: {user?.username}
        </div>
    );
}