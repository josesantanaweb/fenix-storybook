import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const ScreenSizeContext = createContext({ isMobile: false });

// Proveedor del contexto
export const ScreenSizeProvider = ({ children }: {children:any}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para actualizar el estado en función del tamaño de la pantalla
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Cambia 768 al valor que consideres adecuado para tu breakpoint
    };

    // Añadir event listener
    window.addEventListener('resize', handleResize);

    // Llamar a handleResize para establecer el estado inicial
    handleResize();

    // Limpiar el event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isMobile }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

// Hook para usar el contexto
export const useScreenSize = () => useContext(ScreenSizeContext);
