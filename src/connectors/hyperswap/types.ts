import { BigNumber } from 'ethers';

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOutMin: string;
  to: string;
  deadline?: number;
}

export interface SwapResult {
  transactionHash: string;
  amountIn: string;
  amountOut: string;
}

export interface PoolInfo {
  address: string;
  token0: string;
  token1: string;
  reserve0: BigNumber;
  reserve1: BigNumber;
  totalSupply: BigNumber;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export interface LiquidityParams {
  tokenA: string;
  tokenB: string;
  amountADesired: string;
  amountBDesired: string;
  amountAMin: string;
  amountBMin: string;
  to: string;
  deadline?: number;
}

export interface LiquidityResult {
  transactionHash: string;
  amountA: string;
  amountB: string;
  liquidity: string;
} 