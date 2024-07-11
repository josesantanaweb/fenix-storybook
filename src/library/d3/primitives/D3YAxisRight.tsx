import { D3AxisProps } from '../types';

export const uuid = () => {
  return 'xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const D3YAxisRight = ({ ticks, dms, formatter }: D3AxisProps) => {
  return (
    <g transform={`translate(${dms.boundedWidth},0)`}>
      <path
        d={['M', 6, dms.boundedHeight, 'h', -6, 'V', 0, 'h', 6].join(' ')}
        fill="none"
        className="stroke-background-800"
      />
      {ticks.map(({ value, offset }) => (
        <g key={`${uuid()}${value}`} transform={`translate(0,${offset})`}>
          <text
            style={{
              fontSize: '10px',
              textAnchor: 'start',
              transform: 'translate(12px, 3px)',
            }}
            fill="currentColor"
            opacity={0.6}
          >
            {formatter ? formatter(value) : value}
          </text>
        </g>
      ))}
    </g>
  );
};
