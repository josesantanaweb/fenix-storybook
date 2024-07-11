import Image from 'next/image'

const Welcome = () => {
  return (
    <div className="welcome-box">
      <Image
        src="/static/images/modals/abstract.png"
        className="w-[190px] absolute top-[10px] -left-[80px] mix-blend-lighten blur-sm z-20 hidden xl:block"
        alt="logo"
        width={150}
        height={150}
      />
      <div className="w-full relative z-10">
        <div className="md:max-w-[500px] mb-4 relative">
          <Image
            src="/static/images/logo.svg"
            className="w-[150px] h-10 mb-8"
            alt="logo"
            width={150}
            height={40}
            priority
          />
          <p className="mb-4 text-shark-100">Welcome to fenix</p>
          <h3 className="mb-4 text-2xl text-white md:text-4xl">
            The Unified Trading and{' '}
            <span className="text-2xl inline-block text-transparent bg-gradient-to-r from-festival-500 to-outrageous-orange-500 bg-clip-text">
              liquidity marketplace for
            </span>
          </h3>
        </div>
        <div className="items-center hidden gap-2 md:flex">
          <p className="text-xs text-shark-100">2024 © Fenix Finance</p>
          {/* <p className="px-2 py-1 text-xs rounded-md text-shark-100 bg-shark-400 bg-opacity-40">Version: 93a8d72</p> */}
        </div>
      </div>
      <div className="flex items-center h-full"></div>
      <Image
        src="/static/images/modals/abstract.png"
        className="w-[450px] absolute -bottom-[200px] z-20 -right-[90px] mix-blend-lighten blur-sm hidden md:block"
        alt="logo"
        width={150}
        height={150}
      />
    </div>
  )
}

export default Welcome
