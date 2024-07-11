import Link from "next/link"
import { Button } from "../../UI"
import Image from "next/image"
const Community = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center xl:py-48 py-28 relative">
        <div className="absolute overflow-y-hidden h-[382px]  md:-top-5 xl:-top-10  -z-10 bg-[#0A0A0A] opacity-70  mix-blend-color-dodge">
          <Image
            className="opacity-70 bg-center mix-blend-color-dodge"
            src={'/static/images/landing/Community/fenixBird.svg'}
            height={382}
            width={1731}
            alt="fenix"
          />
        </div>
      <div className="bg-shark-600 rounded-full">
        <Image
          src={'/static/images/landing/Community/fenixLogo.svg'}
          className="xl:h-[144px] xl:w-[144px] w-[92px] h-[92px] "
          height={144}
          width={144}
          alt="fenix"
        />
      </div>
      <h2 className="text-gradient3 text-[32px] font-normal leading-relaxed max-lg:text-2xl text-center">
        Join the community
      </h2>
      <Link href={'https://discord.com/invite/fenixfi'} target="_blank">
        <Button className="!max-w-[252px] !font-normal " variant="primary">
          <span>Join Discord</span>
        </Button>
      </Link>
    </div>
  )
}

export default Community