
import { IIconProps } from './types'

const Icon = ({ type, name, size, color, className }: IIconProps) => {
  return (
    <i
      className={`icon icon-${type} icon-${name} ${className || ''} text-[1em] leading-[0]`}
      style={{
        fontSize: size ? (typeof size === 'number' ? size + 'px' : size) : undefined,
        color: color || undefined,
      }}
    />
  )
}

export default Icon
