import { BigNumber } from 'ethers';
import { PoolInfo } from '../types';

export function calculatePriceImpact(
  amountIn: BigNumber,
  amountOut: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber
): number {
  const priceBefore = reserveOut.mul(BigNumber.from(10).pow(18)).div(reserveIn);
  const priceAfter = reserveOut.sub(amountOut).mul(BigNumber.from(10).pow(18)).div(reserveIn.add(amountIn));
  
  const priceImpact = priceBefore.sub(priceAfter).mul(BigNumber.from(10000)).div(priceBefore);
  return priceImpact.toNumber() / 100;
}

export function calculateAmountOut(
  amountIn: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber
): BigNumber {
  const amountInWithFee = amountIn.mul(997);
  const numerator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.mul(1000).add(amountInWithFee);
  return numerator.div(denominator);
}

export function calculateAmountIn(
  amountOut: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber
): BigNumber {
  const numerator = reserveIn.mul(amountOut).mul(1000);
  const denominator = reserveOut.sub(amountOut).mul(997);
  return numerator.div(denominator).add(1);
} 