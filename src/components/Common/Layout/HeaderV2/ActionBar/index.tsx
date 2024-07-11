import AccountHandler from './AccountHandler'
import ButtonNotification from './ButtonNotification'

const ActionBar = () => {
  return (
    <div className="flex items-center gap-3.5 h-[95px]">
      <ButtonNotification />
      <AccountHandler isMenuMobile={false} />
    </div>
  )
}

export default ActionBar
