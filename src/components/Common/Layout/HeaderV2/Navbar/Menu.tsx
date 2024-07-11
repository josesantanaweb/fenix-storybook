'use client'

import { usePathname } from 'next/navigation'
import { MENU_LINKS } from '@/src/constants/menu'
import NavMenuButton from './NavMenuButton'
import ButtonSubMenu from './ButtonSubMenu'

const Menu = () => {
  const pathname = usePathname()
  const isActive = (path: string) => {
    const regex = new RegExp(`^${path}`)
    return regex.test(pathname)
  }

  return (
    <nav>
      <ul className="flex items-center gap-[13px] flex-shrink-0">
        {MENU_LINKS.map((link, index) => (
          <li key={index} className="flex-shrink-0">
            {link.subMenu ? (
              <ButtonSubMenu link={link} />
            ) : (
              <NavMenuButton href={link.path} isActive={isActive(link.path)}>
                {link.name}
              </NavMenuButton>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
