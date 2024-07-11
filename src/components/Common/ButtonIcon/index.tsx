// Helpers
import cn from '@/src/library/utils/cn'

// Models
import { IconsType } from '@/src/components/V2/UI/Icon'

// Components
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/src/components/V2/UI/Icon'
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};
interface IButtonIconProps {
  name: IconsType
  type?: any
  sizeIcon?: number | string
  size?: string
  href?: URL | undefined
  className?: string
  childrenClassName?: string
  image?: string
  src?: StaticImageData | string
}

export default function ButtonIcon({type='regular', href, name, image, className='', childrenClassName='', size='', src, ...props }: IButtonIconProps) {
  const baseClass = "text-base h-[3rem] w-[3rem] bg-neutral-400 border-neutral-300 border hover:bg-primary-200 hover:border-primary-200 rounded-full flex items-center justify-center cursor-pointer transition-all";
  const mergeClassName = cn(
    baseClass,
    className
  )
  const imageBaseClass = "";
  const imagenMergeClassName = cn(
    baseClass,
    className
  )
  const iconBaseClass = "";
  const iconMergeClassName = cn(
    baseClass,
    className
  )
  if (href !== undefined) {
    return (
      <Link className={mergeClassName} href={href} {...props}>
        <Icon type={type} name={name} />
      </Link>
    )
  }
  /* if (image !== undefined) {
    return (
      <div className={mergeClassName} {...props}>
        <Image src={src}
            alt="Blast Gold"
            width={20}
            height={20}
            className=""/>
      </div>
    )
  } */
  return (
    <div className={mergeClassName} {...props}>
      <Icon type={type} name={name} />
    </div>
  )
}
