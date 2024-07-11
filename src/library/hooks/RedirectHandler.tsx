import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useIsMobile  from './useIsMobile';

const RedirectHandler = ({ children }: {children:any}) => {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile();

  useEffect(() => {

    // Redirección basada en el tamaño de la pantalla
    if (isMobile && pathname !== '/trade/swap' && pathname !== '/') {
      router.replace('/trade/swap');
    }
  }, [router, isMobile]);

  return children;
};

export default RedirectHandler;
