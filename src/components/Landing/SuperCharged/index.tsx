import Image from 'next/image'

const Supercharged = () => {
  return (
    <div className="flex justify-center xl:pt-20 xl:pb-10 px-2 w-full h-full  relative overflow-hidden">
     
      <div className="relative">
        <div className="relative">
          <Image
            src={'/static/images/landing/superCharged/fenixRings.svg'}
            className="z-[100] h-[250px] sm:h-[610px] w-[800px]"
            height={610}
            width={1017}
            alt="supercharged"
          />
        </div>
        <Image
          src={'/static/images/landing/blur.svg'}
          className="h-[200px] w-[280px] sm:h-[380px] sm:w-[520px] absolute top-[70%] left-[50%] -translate-x-1/2 -translate-y-1/2 -z-20 "
          height={680}
          width={680}
          alt="supercharged"
        />
      </div>
      <Image
        src={'/static/images/landing/superCharged/decorator.svg'}
        className="absolute -left-80 -z-50"
        height={550}
        width={745}
        alt="meteor"
      />
      <Image
        src={'/static/images/landing/superCharged/meteor.svg'}
        className="h-[250px] sm:h-[550px] absolute -right-80 -z-50"
        height={550}
        width={745}
        alt="meteor"
      />
    </div>
  )
}

export default Supercharged
