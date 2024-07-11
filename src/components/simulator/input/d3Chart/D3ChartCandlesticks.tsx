import { useEffect, useMemo } from 'react';
import { D3ChartHandleLine } from './D3ChartHandleLine';
import { XAxis } from './xAxis';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings, D3YAxisRight, scaleBand, useLinearScale } from '@/src/library/d3';
import { getDomain } from './utils';
import { D3ChartOverlapping } from './overlapping/D3ChartOverlapping';

export type SimulatorType = 'recurring' | 'overlapping';

export type ChartPrices<T = string> = {
  buy: { min: T; max: T };
  sell: { min: T; max: T };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

export interface D3ChartCandlesticksProps {
  className?: string;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates: OnPriceUpdates;
  marketPrice?: number;
  bounds: ChartPrices;
  onDragEnd?: OnPriceUpdates;
  isLimit?: { buy: boolean; sell: boolean };
  dms: D3ChartSettings;
  type: SimulatorType;
  overlappingSpread?: string;
}

export const prettifyNumber = (a: any) => {
	return a
}

export const D3ChartCandlesticks = (props: D3ChartCandlesticksProps) => {
  const {
    data,
    prices,
    onPriceUpdates,
    marketPrice,
    bounds,
    onDragEnd,
    isLimit,
    dms,
    type,
    overlappingSpread,
  } = props;

  const xScale = useMemo(
    () => 
      	scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

  const y = useLinearScale({
    domain: getDomain(data, bounds, marketPrice),
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.1,
  });

  if (!dms.width || !dms.height) return null;
  return (
    <>
      <Candlesticks xScale={xScale} yScale={y.scale} data={data} />
      <D3YAxisRight
        ticks={y.ticks}
        dms={dms}
        formatter={(value: any) => prettifyNumber(value)}
      />
      <XAxis xScale={xScale} dms={dms} />
      {marketPrice && (
        <D3ChartHandleLine
          dms={dms}
          color="white"
          y={y.scale(marketPrice)}
          lineProps={{ strokeDasharray: 2 }}
          label={prettifyNumber(marketPrice ?? '')}
        />
      )}
      {type === 'overlapping' && overlappingSpread !== undefined && (
        <D3ChartOverlapping
          yScale={y.scale}
          dms={dms}
          prices={prices}
          onDragEnd={onDragEnd}
          onPriceUpdates={onPriceUpdates}
          marketPrice={data[0].open ?? 0}
          spread={Number(overlappingSpread)}
        />
      )}
    </>
  );
};
