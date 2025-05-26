import { ethers } from 'ethers';
import { ROUTER_ADDRESS, DEFAULT_DEADLINE, FACTORY_ADDRESS } from './constants';
import { SwapParams, SwapResult, PoolInfo, LiquidityParams, LiquidityResult } from './types';
import * as pricing from './utils/pricing';
import * as pools from './utils/pools';
import * as tokens from './utils/tokens';
import routerABI from './hyperswap_router_abi.json';
import factoryABI from './hyperswap_factory_V2.json';

export class HyperswapConnector {
  private provider: ethers.providers.Provider;
  private router: ethers.Contract;
  private factory: ethers.Contract;

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
    this.router = new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
    this.factory = new ethers.Contract(FACTORY_ADDRESS, factoryABI.abi, provider);
  }

  async getPoolInfo(tokenA: string, tokenB: string): Promise<PoolInfo> {
    // Validate addresses
    if (!tokens.validateTokenAddress(tokenA) || !tokens.validateTokenAddress(tokenB)) {
      throw new Error('Invalid token address');
    }

    // Get pair address from factory
    const pairAddress = await this.factory.getPair(tokenA, tokenB);
    if (pairAddress === ethers.constants.AddressZero) {
      throw new Error('Pool does not exist');
    }

    // Create pair contract instance
    const pairContract = new ethers.Contract(
      pairAddress,
      [
        'function token0() external view returns (address)',
        'function token1() external view returns (address)',
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
        'function totalSupply() external view returns (uint256)'
      ],
      this.provider
    );

    // Get pool data
    const [token0, token1, reserves, totalSupply] = await Promise.all([
      pairContract.token0(),
      pairContract.token1(),
      pairContract.getReserves(),
      pairContract.totalSupply()
    ]);

    return {
      address: pairAddress,
      token0,
      token1,
      reserve0: reserves.reserve0,
      reserve1: reserves.reserve1,
      totalSupply
    };
  }

  async swap(params: SwapParams): Promise<SwapResult> {
    const { tokenIn, tokenOut, amountIn, amountOutMin, to, deadline = DEFAULT_DEADLINE } = params;
    
    // Validate addresses
    if (!tokens.validateTokenAddress(tokenIn) || !tokens.validateTokenAddress(tokenOut)) {
      throw new Error('Invalid token address');
    }

    const path = [tokenIn, tokenOut];
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + deadline;
    const referrer = ethers.constants.AddressZero;

    let tx;
    if (tokens.isNativeToken({ address: tokenIn, symbol: 'HYPE', decimals: 18, name: 'HyperEVM' })) {
      // Swap ETH for tokens
      tx = await this.router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        amountOutMin,
        path,
        to,
        referrer,
        deadlineTimestamp,
        { value: amountIn }
      );
    } else {
      // Swap tokens for ETH
      tx = await this.router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        referrer,
        deadlineTimestamp
      );
    }

    const receipt = await tx.wait();
    return {
      transactionHash: receipt.transactionHash,
      amountIn,
      amountOut: amountOutMin, // TODO: Calculate actual amount out
    };
  }

  async addLiquidity(params: LiquidityParams): Promise<LiquidityResult> {
    const {
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline = DEFAULT_DEADLINE
    } = params;

    // Validate addresses
    if (!tokens.validateTokenAddress(tokenA) || !tokens.validateTokenAddress(tokenB)) {
      throw new Error('Invalid token address');
    }

    const deadlineTimestamp = Math.floor(Date.now() / 1000) + deadline;

    // Add liquidity
    const tx = await this.router.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadlineTimestamp
    );

    const receipt = await tx.wait();
    
    // Get actual amounts used
    const poolInfo = await this.getPoolInfo(tokenA, tokenB);
    const amounts = await this.router.getAmountsOut(amountADesired, [tokenA, tokenB]);

    return {
      transactionHash: receipt.transactionHash,
      amountA: amounts[0].toString(),
      amountB: amounts[1].toString(),
      liquidity: poolInfo.totalSupply.toString()
    };
  }

  async removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: number = DEFAULT_DEADLINE
  ): Promise<LiquidityResult> {
    // Validate addresses
    if (!tokens.validateTokenAddress(tokenA) || !tokens.validateTokenAddress(tokenB)) {
      throw new Error('Invalid token address');
    }

    const deadlineTimestamp = Math.floor(Date.now() / 1000) + deadline;

    // Remove liquidity
    const tx = await this.router.removeLiquidity(
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
      deadlineTimestamp
    );

    const receipt = await tx.wait();

    // Get actual amounts received
    const amounts = await this.router.getAmountsOut(liquidity, [tokenA, tokenB]);

    return {
      transactionHash: receipt.transactionHash,
      amountA: amounts[0].toString(),
      amountB: amounts[1].toString(),
      liquidity: '0' // Liquidity tokens are burned
    };
  }

  async getAmountsOut(amountIn: string, path: string[]): Promise<string[]> {
    const amounts = await this.router.getAmountsOut(amountIn, path);
    return amounts.map(amount => amount.toString());
  }

  async getAmountsIn(amountOut: string, path: string[]): Promise<string[]> {
    const amounts = await this.router.getAmountsIn(amountOut, path);
    return amounts.map(amount => amount.toString());
  }
} 