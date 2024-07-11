import { Abi } from 'viem'

const TICK_MATH_ABI: Abi = [
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'higherTick',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'lowerTick',
        type: 'int24',
      },
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'getAmounts',
    outputs: [
      {
        internalType: 'uint256',
        name: '_amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'sqrtRatioX96',
        type: 'uint160',
      },
      {
        internalType: 'uint160',
        name: 'sqrtRatioAX96',
        type: 'uint160',
      },
      {
        internalType: 'uint160',
        name: 'sqrtRatioBX96',
        type: 'uint160',
      },
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
    ],
    name: 'getAmountsForLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'sqrtRatioX96',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'sqrtRatioAX96',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'sqrtRatioBX96',
        type: 'int24',
      },
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
    ],
    name: 'getAmountsForLiquidityTicks',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: '_price',
        type: 'uint160',
      },
    ],
    name: 'getPriceAndTick',
    outputs: [
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        internalType: 'uint160',
        name: 'price',
        type: 'uint160',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
    ],
    name: 'getSqrtRatioAtTick',
    outputs: [
      {
        internalType: 'uint160',
        name: 'price',
        type: 'uint160',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'price',
        type: 'uint160',
      },
    ],
    name: 'getTickAtSqrtRatio',
    outputs: [
      {
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as Abi

export default TICK_MATH_ABI
