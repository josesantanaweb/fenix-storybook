import Image from 'next/image'

const HowItWorks = () => {
  return (
    <div className="relative w-full  px-5">
      <div className="absolute left-[-360px] bottom-20 z-10">
        <Image
          src="/static/images/landing/howitworks/meteor.png"
          alt="img"
          width={733}
          height={560}
          className="w-full object-contain max-md:hidden"
        />
      </div>

      <p className="text-white text-base md:text-lg md:mb-2 text-center font-light">How it Works</p>

      <h3 className="text-4xl mb-2 md:mb-4 text-center
      text-gradient">
        Fenix Finance
      </h3>

      <p className="text-white text-xs md:text-base text-center md:mb-10">
        Model designed to reward participants that enable sustainable growth for protocol
      </p>

      <div className="mx-auto flex justify-center relative z-50 mix-blend-lighten">
        <video width={733} height={560} loop playsInline autoPlay muted>
          <source src="/static/images/landing/howitworks/triangle.mp4" type="video/mp4"></source>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default HowItWorks
