
import ReferralDecorator from '@/src/components/Common/Layout/BackgroundReferral'
import Referrals from '@/src/components/referrals'
import { Fragment } from 'react'
import Image from 'next/image'
export const metadata = {
  title: 'Referrals | Fenix Finance',
  description:
    // eslint-disable-next-line max-len
    'Referrals',
}
const ReferralsPage = () => {
  return (
    <Fragment>
      <main className="container relative pt-5 overflow-hidden">
        <ReferralDecorator />
        <Referrals />
      </main>
      <div className="absolute top-6 bottom-0 left-0 right-0 w-full max-lg:hidden">
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={'https://blur.io/blast/collection/fenix-goldies'}
          className="absolute w-[154px] xl:!top-32 lg:!top-32 2xl:!right-36 xl:!right-28 lg:!right-28 py-4 px-5 flex items-center justify-center group z-[100] cursor-pointer"
        >
          <div className="z-30 text-xs text-white font-light w-full">
            If you hold 20 Fenix Goldies, you earn a 20% boost too
          </div>
          <Image
            src={'/static/images/referrals/comment-box.svg'}
            alt="Comment"
            height={675}
            width={620}
            className="w-full z-10 absolute top-0 bottom-0 left-0 right-0 transition-all group-hover:opacity-0 opacity-100"
          />
          <Image
            src={'/static/images/referrals/comment-box-hover.svg'}
            alt="Comment"
            height={675}
            width={620}
            className="w-full z-10 absolute top-0 bottom-0 left-0 right-0 transition-all group-hover:opacity-100 opacity-0"
          />
        </a>
        <Image
          src={'/static/images/referrals/ellipse.svg'}
          alt="Comment"
          height={906}
          width={391}
          className="z-10 absolute right-0 lg:top-40 xl:top-28 2xl:top-16"
        />

        <Image
          src={'/static/images/referrals/nft-goldie.svg'}
          alt="NFT Goldie"
          height={535}
          width={369}
          className="absolute 2xl:w-[269px] xl:w-[220px] lg:w-[220px] lg:top-56 xl:top-56 2xl:top-60 right-0"
        />
      </div>
    </Fragment>
  )
}

export default ReferralsPage
