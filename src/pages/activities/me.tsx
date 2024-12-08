import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';

export function MyActivityPage() {
    const { user } = useAuth();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "My Activity" }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is my activities page
        </div>
    );
}