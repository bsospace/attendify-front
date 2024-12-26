import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/providers/breadcrumb-provider'

export function HomePage () {
  const { user, isAuthenticated, isLoading } = useAuth()

  const [, setBreadcrumbs] = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([{ name: 'Home' }])

    return () => setBreadcrumbs(null)
  }, [setBreadcrumbs])

  return (
    <div className='space-y-6'>
      {isAuthenticated && (
        <h1 className='text-2xl font-semibold'>
          Welcome back,{' '}
          {user?.username == null ? user?.email : (user?.email).split('@')[0]}!
        </h1>
      )}

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Quick Stats</h2>
          <p className='text-gray-500'>Your dashboard content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Recent Activity</h2>
          <p className='text-gray-500'>Your activity content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Notifications</h2>
          <p className='text-gray-500'>Your notifications here</p>
        </Card>
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Quick Stats</h2>
          <p className='text-gray-500'>Your dashboard content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Recent Activity</h2>
          <p className='text-gray-500'>Your activity content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Notifications</h2>
          <p className='text-gray-500'>Your notifications here</p>
        </Card>
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Quick Stats</h2>
          <p className='text-gray-500'>Your dashboard content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Recent Activity</h2>
          <p className='text-gray-500'>Your activity content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Notifications</h2>
          <p className='text-gray-500'>Your notifications here</p>
        </Card>
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Quick Stats</h2>
          <p className='text-gray-500'>Your dashboard content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Recent Activity</h2>
          <p className='text-gray-500'>Your activity content here</p>
        </Card>

        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-2'>Notifications</h2>
          <p className='text-gray-500'>Your notifications here</p>
        </Card>
      </div>
    </div>
  )
}
