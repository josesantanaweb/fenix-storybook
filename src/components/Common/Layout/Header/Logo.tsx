import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <div className="flex items-center min-w-[50px] z-10 h-[40px] w-full">
      <Link href="/" title="Fenix">
        <Image
          src="/static/images/logo.svg"
          className="w-[9.375rem] h-10"
          alt="Fenix logo"
          width={150}
          height={40}
          priority
        />
      </Link>
    </div>
  )
}

export default Logo
