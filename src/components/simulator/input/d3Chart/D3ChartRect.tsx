import { cn } from '@/src/utils/helpers';
import { SVGProps } from 'react';

interface RectProps extends SVGProps<SVGRectElement> {
  selector: string;
  isDragging: boolean;
}
export const D3ChartRect = ({ selector, isDragging, ...props }: RectProps) => {
  return (
    <rect
      className={cn(selector, {
        'cursor-grab': !isDragging,
        'cursor-grabbing': isDragging,
      })}
      fillOpacity={0.15}
      {...props}
    />
  );
};
