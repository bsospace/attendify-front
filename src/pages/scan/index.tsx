import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/breadcrumb-provider';

export function ScanPage() {
    const { user } = useAuth();

    const [, setBreadcrumbs] = useBreadcrumb();

    useEffect(() => {
        setBreadcrumbs([
        { name: "Scan" }
        ]);

        return () => setBreadcrumbs(null);
    }, [setBreadcrumbs]);

    return (
        <div className="space-y-6">
        this is the Scan page
        </div>
    );
}