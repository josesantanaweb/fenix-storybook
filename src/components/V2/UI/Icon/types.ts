export type IconsType =
  | 'arrow-top-right'
  | 'logout'
  | 'settings'
  | 'arrow-down-01-sharp'
  | 'bridge'
  | 'chart-high-low'
  | 'hourglass'
  | 'graph-up'
  | 'park-outline-chart-stock'
  | 'arrow-left-right-sharp'
  | 'notification-01'
  | 'sun-03'
  | 'wallet-01'
  | 'checkmark-circle-02'
  | 'cancel-circle'
  | 'alert-circle';
interface IIconBaseProps {
  /** The name of the icon to be displayed. */
  name: IconsType;

  /** The size of the icon. Can be a number (pixels) or a string (CSS units).*/
  size?: number | string;

  /** The color of the icon. */
  color?: string;

  /** Additional CSS classes to apply to the icon. */
  className?: string;
}

interface IRegularIconProps extends IIconBaseProps {
  /** The type of the icon, in this case, 'regular'. */
  type: 'regular';
}

interface IBrandIconProps extends IIconBaseProps {
  /** The type of the icon, in this case, 'brand'. */
  type: 'brand';
}

export type IIconProps = IRegularIconProps | IBrandIconProps;
