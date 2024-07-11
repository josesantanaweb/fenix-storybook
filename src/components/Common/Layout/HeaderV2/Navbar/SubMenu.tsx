import { useMemo, useState } from 'react'
import Icon, { IconsType } from '../../../../V2/UI/Icon'

const SUBMENU_ITEMS: Array<{
  label: string
  icon: IconsType
}> = [
  {
    label: 'Swap',
    icon: 'arrow-left-right-sharp',
  },
  {
    label: 'DCA',
    icon: 'hourglass',
  },
  {
    label: 'Limit / Range Orders',
    icon: 'graph-up',
  },
  {
    label: 'Recurring Orders',
    icon: 'chart-high-low',
  },
  {
    label: 'Bridge',
    icon: 'bridge',
  },
  {
    label: 'Perpetuals',
    icon: 'park-outline-chart-stock',
  },
]

const Button = ({
  children,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode
  active?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) => {
  return (
    <button
      className={`navbar-submenu-button ${active ? 'active' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  )
}

const SubMenu = () => {
  const [currentHover, setCurrentHover] = useState<number | null>(null)
  const [currentActive, setCurrentActive] = useState<number>(0)
  const leffOffset = useMemo(() => {
    return (currentHover !== null ? currentHover * 175 : currentActive * 175) + 87.5 - 3
  }, [currentActive, currentHover])

  return (
    <div className="border border-neutral-300 h-[55px] w-full rounded-full flex items-start justify-center pt-[6px]">
      <div className="relative flex">
        {SUBMENU_ITEMS.map((item, index) => (
          <Button
            key={index}
            active={currentHover ? currentHover === index : currentActive === index}
            onMouseEnter={() => setCurrentHover(index)}
            onMouseLeave={() => setCurrentHover(null)}
          >
            <Icon type="regular" name={item.icon} />
            <span>{item.label}</span>
          </Button>
        ))}
        <div
          className="w-1.5 h-1.5 pointer-events-none rounded-full bg-primary-200 absolute -bottom-px transition-transform duration-[750ms] ease-[cubic-bezier(0.28,1.06,0.61,1.07)]"
          style={{
            transform: `translateX(${leffOffset}px)`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default SubMenu
