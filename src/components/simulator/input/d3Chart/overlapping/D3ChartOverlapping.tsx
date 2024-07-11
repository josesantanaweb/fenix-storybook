import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import {
  handleStateChange,
  onDragBuyHandler,
  onDragRectHandler,
  onDragSellHandler,
} from './utils';
import { ScaleLinear } from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { D3ChartCandlesticksProps, prettifyNumber } from '../D3ChartCandlesticks';
import { D3ChartHandleLine } from '../D3ChartHandleLine';
import { D3ChartOverlappingRangeGroup } from './D3ChartOverlappingRangeGroup';
import { getHandleSelector, getSelector } from '../utils';
import { D3ChartPriceOutOfScale } from '../D3ChartPriceOutOfScale';
import { D3ChartOverlappingHandle } from './D3ChartOverlappingHandle';
import { formatNumber } from '@/src/library/utils/numbers';

type Props = Pick<
  D3ChartCandlesticksProps,
  'prices' | 'onPriceUpdates' | 'dms' | 'onDragEnd'
> & {
  yScale: ScaleLinear<number, number>;
  marketPrice?: number;
  spread: number;
};

export const getMinSellMax = (buyMin: number, spread: number) => {
  return buyMin / (1 - spread / 100) ** 2;
};

export const getMaxBuyMin = (sellMax: number, spread: number) => {
  return sellMax * (1 - spread / 100) ** 2;
};

export const D3ChartOverlapping = (props: Props) => {
  const {
    dms,
    yScale,
    prices,
    marketPrice,
    onPriceUpdates,
    onDragEnd,
    spread,
  } = props;

  const isDragging = useRef(false);

  const selectorHandleBuyMin = getHandleSelector('buy', 'line1');
  const selectorHandleBuyMax = getHandleSelector('buy', 'line2');

  const selectorHandleSellMax = getHandleSelector('sell', 'line1');
  const selectorHandleSellMin = getHandleSelector('sell', 'line2');

  const yPos = useMemo(
    () => ({
      buy: {
        min: yScale(Number(prices.buy.min)),
        max: yScale(Number(prices.buy.max)),
      },
      sell: {
        min: yScale(Number(prices.sell.min)),
        max: yScale(Number(prices.sell.max)),
      },
      marketPrice: marketPrice ? yScale(marketPrice) : 0,
    }),
    [prices, yScale, marketPrice]
  );

  const calcPrices = useCallback(
    (buyMin: string, sellMax: string) => {
      return calculateOverlappingPrices(
        formatNumber(Number(buyMin)),
        formatNumber(Number(sellMax)),
        marketPrice?.toString() ?? '0',
        spread.toString()
      );
    },
    [marketPrice, spread]
  );

  const onDragBuy = useCallback(
    (y: number) => {
      isDragging.current = true;

      const maximumBuyMin = getMaxBuyMin(Number(prices.sell.max), spread);
      const maximumBuyMinY = yScale(maximumBuyMin);
      if (y < maximumBuyMinY) {
        y = maximumBuyMinY;
      }
      const buyMin = yScale.invert(y).toString();
      const { sellPriceLow } = calcPrices(buyMin, prices.sell.max);
      onDragBuyHandler({
        y,
        y2: yScale(Number(sellPriceLow)),
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: buyMin, max: prices.buy.max },
        sell: { min: sellPriceLow, max: prices.sell.max },
      });
    },
    [
      calcPrices,
      onPriceUpdates,
      prices.buy.max,
      prices.sell.max,
      spread,
      yPos.marketPrice,
      yScale,
    ]
  );

  const onDragEndBuy = useCallback(() => {
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('buy', 'line1')).select('line').attr('y1')
    );
    const buyMin = yScale.invert(y).toString();
    const { sellPriceLow } = calcPrices(buyMin, prices.sell.max);
    onDragEnd?.({
      buy: { min: buyMin, max: prices.buy.max },
      sell: { min: sellPriceLow, max: prices.sell.max },
    });
  }, [calcPrices, onDragEnd, prices.buy.max, prices.sell.max, yScale]);

  const onDragSell = useCallback(
    (y: number) => {
      isDragging.current = true;

      const minimumSellMax = getMinSellMax(Number(prices.buy.min), spread);
      const minimumSellMaxY = yScale(minimumSellMax);
      if (y > minimumSellMaxY) {
        y = minimumSellMaxY;
      }
      const sellMax = yScale.invert(y).toString();
      const { buyPriceHigh } = calcPrices(prices.buy.min, sellMax);
      onDragSellHandler({
        y,
        y2: yScale(Number(buyPriceHigh)),
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: prices.buy.min, max: buyPriceHigh },
        sell: { min: prices.sell.min, max: sellMax },
      });
    },
    [
      calcPrices,
      onPriceUpdates,
      prices.buy.min,
      prices.sell.min,
      spread,
      yPos.marketPrice,
      yScale,
    ]
  );

  const onDragEndSell = useCallback(() => {
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('sell', 'line1')).select('line').attr('y1')
    );
    const sellMax = yScale.invert(y).toString();
    const { buyPriceHigh } = calcPrices(prices.buy.min, sellMax);
    onDragEnd?.({
      buy: { min: prices.buy.min, max: buyPriceHigh },
      sell: { min: prices.sell.min, max: sellMax },
    });
  }, [calcPrices, onDragEnd, prices.buy.min, prices.sell.min, yScale]);

  const onDragRect = useCallback(
    (y: number, y2: number) => {
      isDragging.current = true;

      const sellMax = yScale.invert(y).toString();
      const buyMin = yScale.invert(y2).toString();
      const { buyPriceHigh, sellPriceLow } = calcPrices(buyMin, sellMax);
      onDragRectHandler({
        yPos: {
          sell: { min: yScale(Number(sellPriceLow)), max: y },
          buy: { min: y2, max: yScale(Number(buyPriceHigh)) },
        },
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onPriceUpdates, yPos.marketPrice, yScale]
  );

  const onDragEndRect = useCallback(
    (y: number, y2: number) => {
      isDragging.current = false;

      const sellMax = yScale.invert(y).toString();
      const buyMin = yScale.invert(y2).toString();
      const { buyPriceHigh, sellPriceLow } = calcPrices(buyMin, sellMax);
      onDragEnd?.({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onDragEnd, yScale]
  );

  useEffect(() => {
    if (isDragging.current) {
      return;
    }

    handleStateChange({
      yPos,
      marketPriceY: yPos.marketPrice,
    });
  }, [yPos]);

  const maxIsOutOfScale = yPos.sell.max <= 0;
  const minIsOutOfScale = yPos.buy.min >= dms.boundedHeight;

  return (
    <>
      <D3ChartHandleLine
        selector={selectorHandleSellMin}
        handleClassName="opacity-40"
        dms={dms}
        color="var(--sell)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.sell.min ?? '')}
      />
      <D3ChartHandleLine
        selector={selectorHandleBuyMax}
        handleClassName="opacity-40"
        dms={dms}
        color="var(--buy)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.buy.max ?? '')}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleBuyMin}
        dms={dms}
        onDrag={onDragBuy}
        onDragEnd={onDragEndBuy}
        color="var(--buy)"
        label={prettifyNumber(prices.buy.min ?? '')}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleSellMax}
        dms={dms}
        onDrag={onDragSell}
        onDragEnd={onDragEndSell}
        color="var(--sell)"
        label={prettifyNumber(prices.sell.max ?? '')}
      />
      <D3ChartOverlappingRangeGroup
        dms={dms}
        onDrag={onDragRect}
        onDragEnd={onDragEndRect}
      />
      <D3ChartPriceOutOfScale
        type="buy"
        minOutOfScale={minIsOutOfScale}
        maxOutOfScale={false}
        color="var(--buy)"
        dms={dms}
      />
      <D3ChartPriceOutOfScale
        type="sell"
        minOutOfScale={false}
        maxOutOfScale={maxIsOutOfScale}
        color="var(--sell)"
        dms={dms}
      />
    </>
  );
};
