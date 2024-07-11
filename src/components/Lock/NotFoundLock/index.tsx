interface NotFoundLockProps {
  info?: string
}

const NotFoundLock = ({ info = '' }: NotFoundLockProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-lg ">
      <span className="text-5xl icon-circles text-shark-100"></span>
      <p className="text-sm text-shark-100">{info === '' ? <>No Locks found</> : <>{info}</>}</p>
    </div>
  )
}

export default NotFoundLock
