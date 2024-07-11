import MainBox from '@/src/components/Common/Boxes/MainBox'
import InfoBox from '@/src/components/Common/InfoBox'
import { REWARD_LIST } from '../datacopy'

const ClaimBox = () => {
  return (
    <MainBox className="xl:min-h-[300px]">
      <div className="flex flex-col items-center justify-between w-full xl:flex-row relative z-10">
        <div className="w-full xl:w-1/2">
          <h4 className="mb-3 text-2xl font-semibold text-white">Claims</h4>
          <p className="mb-4 text-xs text-shark-100 font-normal">
            Select your veFNX and use 100% of your votes for one or more pools to earn bribes and trading fees.
          </p>
          {/* <div>
            <Button variant="primary" className="flex gap-2 items-center !text-xs !font-normal">
              <span className="icon-wallet"></span>
              Connect your Wallet
            </Button>
          </div>
          <Link href={""} className="flex gap-2 items-center text-shark-100 text-xs py-2">
            <span className="icon-link"></span>
            <p>About Migration</p>
          </Link> */}
        </div>
        <div className="relative flex justify-center flex-col xl:min-h-[250px] w-full xl:w-[40%]">
          {REWARD_LIST.map((exchange, index) => (
            <InfoBox key={index} data={exchange} hasTooltip={false} hasDecorator={index !== REWARD_LIST.length - 1} />
          ))}
          {/* <div className='mx-auto text-sm mt-5'>
            <Link target="_blank" href="https://discord.com/invite/fenixfi" className="text-shark-100 gap-2 flex items-center">
              <span className="icon-discord"></span>
              Need some help?
            </Link>
          </div> */}
        </div>
      </div>
    </MainBox>
  )
}

export default ClaimBox
