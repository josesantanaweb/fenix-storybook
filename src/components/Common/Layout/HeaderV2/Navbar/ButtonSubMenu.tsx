import { ILink } from '@/src/constants/menu'
import NavMenuButton from '@/src/components/Common/Layout/HeaderV2/Navbar/NavMenuButton'
import Icon from '../../../../V2/UI/Icon'
import { useIsActiveSubMenu, useSetActiveSubMenu } from '@/src/state/user/hooks'

const ButtonSubMenu = ({ link }: { link: ILink }) => {
  const activeSubMenu = useIsActiveSubMenu()
  const setActiveSubMenu = useSetActiveSubMenu()

  return (
    <div className="">
      <NavMenuButton
        onClick={() => {
          setActiveSubMenu(!activeSubMenu)
        }}
        isActive={activeSubMenu}
      >
        <span>{link.name}</span>
        <Icon name="arrow-down-01-sharp" type="regular" />
      </NavMenuButton>
    </div>
  )
}

export default ButtonSubMenu
