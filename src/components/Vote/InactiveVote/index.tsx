import Image from 'next/image'

interface InactiveVoteProps {
  handlerChange?: () => void
}

const InactiveVote = ({ handlerChange }: InactiveVoteProps) => {
  return (
    <div className="flex w-full flex-wrap justify-between  gap-2 p-5 text-white border-solid border-1 relative
     border-shark-400 bg-shark-400 bg-opacity-40 rounded-xl">
      <div className="flex justify-between items-center w-full xl:w-auto xl:gap-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handlerChange}>
          <Image
            alt="logo-fenix"
            src={'/static/images/vote/fenix-logo.svg'}
            className="h-[48px] w-[48px]"
            width={61}
            height={61}
          />
          <div className="flex items-center justify-between gap-2 text-sm ">
            <p>
              Select your <span className="font-bold">FNX</span>
            </p>
          </div>
        </div>
        <span className="icon-chevron "></span>
      </div>
      <div
        className="flex  gap-2 w-/2 p-2 ms-10 xl:mx-0 items-center
         bg-shark-300 text-shark-100 bg-opacity-40 border border-solid rounded-lg
         border-shark-400  text-xs xl:absolute top-2 right-2"
      >
        <span className="icon-wallet"></span>
        <p>Positions Locked: 0</p>
      </div>
    </div>
  )
}

export default InactiveVote
