interface NoPositionFoundProps {
  info?: string
}

const NoPositionFound = ({ info = '' }: NoPositionFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-lg ">
      <span className="text-5xl icon-circles text-shark-100"></span>
      <p className="text-sm text-shark-100">{info === '' ? <>No Position found</> : <>{info}</>}</p>
    </div>
  )
}

export default NoPositionFound
