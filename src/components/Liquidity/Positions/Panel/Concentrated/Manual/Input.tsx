const Input = ({ title }: { title: string }) => {
  return (
    <div className="text-white flex-grow">
      <div className="mb-2 text-xs leading-normal">{title}</div>
      <div className="relative w-full text-sm leading-normal">
        <input
          type="text"
          placeholder="0"
          className="bg-shark-300 bg-opacity-40 border border-shark-200 h-[55px] w-full rounded-lg outline-none px-3 text-sm"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 ">-15%</div>
      </div>
    </div>
  )
}

export default Input
