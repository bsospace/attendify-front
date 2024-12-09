import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { useParams } from 'react-router-dom';

export function EditUserPage() {
    const { user } = useAuth();
    const { id } = useParams();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "User", href: "/users" },
        { name: `Edit ${id}` }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is the edit user page
        id: {id}
        </div>
    );
}