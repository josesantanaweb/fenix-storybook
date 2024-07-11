import { usePathname } from 'next/navigation'

const useIsLandingPage = (): boolean => {
  const pathname = usePathname()

  return pathname === '/'
}

export default useIsLandingPage
