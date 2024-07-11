import Image from 'next/image'

const ReferralDecorator = () => {
  return (
    <>
      {/* <div className="absolute w-full ">
        <Image
          className="mix-blend-lighten"
          src={'/static/images/texture-referrals.svg'}
          alt=""
          height={1431}
          width={1920}
        />
      </div> */}
      <div className="absolute left-0 xl:-left-20 w-[578px] h-[766px] top-10 ">
        <Image
          className="mix-blend-lighten"
          src={'/static/images/landing/superCharged/decorator.svg'}
          alt=""
          height={1204}
          width={1452}
        />
      </div>
      <div className="absolute max-w-[1127px] max-sm:-right-10 max-sm:-top-32 xl:-right-52   sm:bottom-44">
        <Image
          className="mix-blend-lighten sm:w-[766px] sm:h-[578px]"
          src={'/static/images/landing/superCharged/meteor.svg'}
          alt=""
          height={578}
          width={766}
        />
      </div>
    </>
  )
}

export default ReferralDecorator
