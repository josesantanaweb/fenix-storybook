import { ReactNode, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

  /** The variant of the button, determining its style. */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'green' | 'red'

  /** The position icon of the button. */
  iconPosition?: 'left' | 'right';

  /** The className icon of the button. */
  iconClassName?: string;
}
