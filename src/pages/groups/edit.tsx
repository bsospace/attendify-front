import { useAuth, User } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { useParams } from 'react-router-dom';

export function EditGroupPage() {
    const { user } = useAuth() as { user: User };
    const { id } = useParams();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Group", href: "/groups" },
        { name: `Edit ${id}` }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is edit group page
        id: {id}
        user: {user?.username}
        </div>
    );
}