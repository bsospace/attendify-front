import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { useParams } from 'react-router-dom';

export function GroupPage() {
    const { user } = useAuth();
    const { id } = useParams();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Group", href: "/groups" },
        { name: id }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is the view group page
        id: {id}
        </div>
    );
}