import { useAuth, User } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';
import { CreateGroupDialog } from './create';

export function AllGroupPage() {
    const { user } = useAuth() as { user: User };

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Groups" }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    console.log(user);
    

    return (
        <div className="space-y-6">
        this is the view all groups page
        user: {user?.username} <br />
        userid : {user?.id}
        <CreateGroupDialog />
        </div>
    );
}