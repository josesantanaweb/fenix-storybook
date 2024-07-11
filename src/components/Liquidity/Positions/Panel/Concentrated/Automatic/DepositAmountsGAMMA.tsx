import { Button } from '@/src/components/UI'
import Image from 'next/image'

const DepositAmountsGAMMA = ({
  firstToken,
  secondToken,
}: {
  firstToken: { name: string; symbol: string }
  secondToken: { name: string; symbol: string }
}) => {
  return (
    <div className="bg-shark-400 bg-opacity-40 px-[15px] py-[29px] md:px-[19px] border border-shark-950 rounded-[10px] mb-2.5">
      <div className="text-xs leading-normal text-white mb-2">Deposit amounts</div>
      <div className="flex items-center gap-3 mb-[14px]">
        <div className="relative w-full xl:w-3/5">
          <input
            type="text"
            placeholder="0"
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
          <div className="absolute right-2 top-[10px] flex items-center gap-1 max-md:hidden">
            <Button variant="tertiary" className="!py-1 !px-3">
              Half
            </Button>
            <Button variant="tertiary" className="!py-1 !px-3">
              Max
            </Button>
          </div>
        </div>

        <div className="relative xl:w-2/5 flex-shrink-0">
          <div className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]">
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/${firstToken.symbol}.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={20}
                height={20}
              />
              <span className="text-base">{firstToken.symbol}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-full xl:w-3/5">
          <input
            type="text"
            placeholder="0"
            className="bg-shark-400 bg-opacity-40 border border-shark-400 h-[50px] w-full rounded-lg outline-none px-3 text-white text-sm"
          />
          <div className="absolute right-2 top-[10px] flex items-center gap-1 max-md:hidden">
            <Button variant="tertiary" className="!py-1 !px-3">
              Half
            </Button>
            <Button variant="tertiary" className="!py-1 !px-3">
              Max
            </Button>
          </div>
        </div>

        <div className="relative xl:w-2/5 flex-shrink-0">
          <div className="bg-shark-400 bg-opacity-40 rounded-lg text-white px-4 flex items-center justify-between h-[50px]">
            <div className="flex items-center gap-2">
              <Image
                src={`/static/images/tokens/${secondToken.symbol}.svg`}
                alt="token"
                className="w-6 h-6 rounded-full"
                width={20}
                height={20}
              />
              <span className="text-base">{secondToken.symbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositAmountsGAMMA
