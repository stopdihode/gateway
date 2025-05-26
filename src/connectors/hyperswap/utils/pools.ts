import { BigNumber } from 'ethers';
import { PoolInfo } from '../types';

export function getPoolKey(tokenA: string, tokenB: string): string {
  return [tokenA.toLowerCase(), tokenB.toLowerCase()].sort().join('-');
}

export function validatePool(pool: PoolInfo): boolean {
  return (
    pool.address !== '' &&
    pool.token0 !== '' &&
    pool.token1 !== '' &&
    pool.reserve0.gt(0) &&
    pool.reserve1.gt(0) &&
    pool.totalSupply.gt(0)
  );
}

export function calculatePoolLiquidity(
  reserve0: BigNumber,
  reserve1: BigNumber,
  decimals0: number,
  decimals1: number
): BigNumber {
  const sqrtK = BigNumber.from(
    Math.sqrt(
      Number(
        reserve0
          .mul(BigNumber.from(10).pow(decimals1))
          .div(reserve1.mul(BigNumber.from(10).pow(decimals0)))
      )
    )
  );
  return sqrtK.mul(2);
} 