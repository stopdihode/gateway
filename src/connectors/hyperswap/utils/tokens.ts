import { BigNumber } from 'ethers';
import { TokenInfo } from '../types';

export function validateTokenAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatTokenAmount(
  amount: BigNumber,
  decimals: number
): string {
  return amount.mul(BigNumber.from(10).pow(decimals)).toString();
}

export function parseTokenAmount(
  amount: string,
  decimals: number
): BigNumber {
  return BigNumber.from(amount).div(BigNumber.from(10).pow(decimals));
}

export function isNativeToken(token: TokenInfo): boolean {
  return token.symbol === 'HYPE' && token.decimals === 18;
} 