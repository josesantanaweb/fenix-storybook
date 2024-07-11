import Icon from "@/src/components/V2/UI/Icon"

const ButtonNotification = () => {
  return (
    <div className="w-12 h-12 relative">
      <button
        type="button"
        title="Notifications"
        className="w-12 h-12 left-0 top-0 absolute rounded-full border bg-neutral-400  border-neutral-300 hover:bg-primary-200 hover:border-primary-200 transition-colors flex items-center justify-center group text-white"
      >
        <span className="block w-[1.25rem] h-[1.25rem] relative">
          <span className="absolute top-0 right-[-3px] w-3 h-3 rounded-full border border-neutral-300 bg-primary-200 group-hover:border-white transition-colors"></span>
          <Icon type="regular" name="notification-01" className="text-xl" />
        </span>
      </button>
    </div>
  )
}

export default ButtonNotification
