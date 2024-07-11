import Link from 'next/link'

const NavMenuButton = ({
  href,
  isActive,
  children,
  onClick,
}: {
  href?: string
  isActive?: boolean
  children: React.ReactNode
  onClick?: () => void
}) => {
  if (href) {
    return (
      <Link href={href} className={`${isActive ? 'active' : ''} navbar-button`} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <button className={`${isActive ? 'active' : ''} navbar-button`} onClick={onClick}>
      {children}
    </button>
  )
}

export default NavMenuButton
