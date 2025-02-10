import { Loader2 } from 'lucide-react'

function Callback () {
  // get access token and refresh token from url query parameters
  const urlParams = new URLSearchParams(window.location.search)

  const accessToken = urlParams.get('accessToken')
  const refreshToken = urlParams.get('refreshToken')

  console.log(accessToken)
  console.log(refreshToken)
  

  // set access token to local storage
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }

  if(!accessToken || !refreshToken){
    window.location.href = '/login'
  }

  window.location.href = '/'

  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader2 className='w-12 h-12 animate-spin' />
    </div>
  )
}

export default Callback
