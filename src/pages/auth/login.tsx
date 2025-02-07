import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { config } from '@/server/config/index'
import { FaGoogle, FaGithub, FaDiscord } from 'react-icons/fa'
import { Loader2 } from 'lucide-react'

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage () {
  const { login, isLoading, oauthLogin } = useAuth()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
    } catch {
      setError('Invalid email or password')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-12 h-12 animate-spin' />
      </div>
    )
  }

  return (
    <div className="md:max-w-fit md:max-h-fit md:space-y-8 bg-white md:rounded-lg md:shadow-lg md:w-auto p-8 flex items-center">
      <div className='max-w-sm mx-auto p-6 space-y-6'>
        <div className='space-y-2 text-center'>
          <img
            src={config.appLogo}
            alt={config.appName}
            className='mb-4 md:h-32 h-16 mx-auto rounded-lg'
          />
          <h1 className='text-2xl font-bold'>{config.appName}</h1>
          <p className='text-gray-500'>Enter your credentials to sign in</p>
        </div>

        {error && <Alert variant='destructive'>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='text-sm text-red-500'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              {...register('password')}
              placeholder='Enter your password'
            />
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <div className='text-center'>
          <p className='text-gray-500'>Or sign in with</p>
          <div className='md:flex justify-center md:space-x-4 md:space-y-0 space-y-1 mt-4'>
            <Button
              onClick={() => oauthLogin('google')}
              variant='outline'
              className='w-full hover:bg-red-500 hover:text-white hover:border-red-500'
            >
              <FaGoogle className='mr-2' />
              Google
            </Button>
            <Button
              onClick={() => oauthLogin('github')}
              variant='outline'
              className='w-full hover:bg-black hover:text-white hover:border-black'
            >
              <FaGithub className='mr-2' />
              GitHub
            </Button>
            <Button
              onClick={() => oauthLogin('discord')}
              variant='outline'
              className='w-full hover:bg-blue-500 hover:text-white hover:border-blue-500'
            >
              <FaDiscord className='mr-2' />
              Discord
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
