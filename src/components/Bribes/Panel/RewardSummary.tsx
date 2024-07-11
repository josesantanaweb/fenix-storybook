import Image from 'next/image'
import { Button } from '@/src/components/UI'
import { formatCurrency } from '@/src/library/utils/numbers'
interface ChoosePoolProps {
  token: any
  value: number
  rewardToken: any
}
const RewardSummary = ({ token, value, rewardToken }: ChoosePoolProps) => {
  //
  return (
    <>
      <div className="bg-shark-400 bg-opacity-40 py-[11px] px-[19px] flex items-center justify-between gap-2.5 border border-shark-950 rounded-[10px] mb-2.5 max-md:items-start">
        <div>
          <div className="text-white text-xs mb-2 block">Reward the Pool</div>
          {token == 'Select a Pool' ? (
            <>
              <div className="text-white text-xs mb-2 block">{}</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex items-center flex-shrink-0">
                  <Image
                    src={`/static/images/tokens/${token.token0Symbol}.png`}
                    alt="token"
                    className="rounded-full w-6 h-6"
                    width={30.5}
                    height={30.5}
                  />
                  <Image
                    src={`/static/images/tokens/${token.token1Symbol}.png`}
                    alt="token"
                    className="-ml-2.5 md:-ml-2 rounded-full w-6 h-6"
                    width={30.5}
                    height={30.5}
                  />
                </div>
                <div className="flex gap-5">
                  <h5 className="text-xs md:text-sm text-white leading-normal font-medium">
                    {token.token0Symbol} / {token.token1Symbol}
                  </h5>
                  <div className="flex items-center gap-3 max-md:flex-wrap">
                    <span className="bg-green-300 py-1 px-2 bg-opacity-20 rounded-lg text-white border border-green-500 text-xs">
                      {!token.pair.hasOwnProperty('stable')
                        ? 'Concentrated Pool'
                        : token.pair.stable
                          ? 'Stable Pool'
                          : 'Volatile Pool'}
                    </span>

                    {/* <Button
                      variant="tertiary"
                      className="!px-5 !py-0 h-[28px] !border-opacity-100 [&:not(:hover)]:border-shark-200 !bg-shark-300 !bg-opacity-40 max-md:!text-xs flex-shrink-0"
                    >
                      0.0%
                    </Button> */}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-xs  text-center leading-normal text-shark-100">
          <p className="md:mb-[5px]">Reward Value</p>
          <p className="md:mb-[5px]">$ {formatCurrency((value * rewardToken?.price).toFixed(2).replace('NaN', '0'))}</p>
        </div>
      </div>
    </>
  )
}

export default RewardSummary
