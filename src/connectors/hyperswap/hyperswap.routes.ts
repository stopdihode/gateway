import { FastifyInstance } from 'fastify';
import { HyperswapController } from './hyperswap.controllers';
import { SwapParams, LiquidityParams } from './types';

export async function registerHyperswapRoutes(
  fastify: FastifyInstance,
  controller: HyperswapController
) {
  // Get pool info
  fastify.get<{ Params: { tokenA: string; tokenB: string } }>(
    '/pools/:tokenA/:tokenB',
    {
      schema: {
        params: {
          type: 'object',
          required: ['tokenA', 'tokenB'],
          properties: {
            tokenA: { type: 'string' },
            tokenB: { type: 'string' },
          },
        },
      },
    },
    controller.getPoolInfo.bind(controller)
  );

  // Swap tokens
  fastify.post<{ Body: SwapParams }>(
    '/swap',
    {
      schema: {
        body: {
          type: 'object',
          required: ['tokenIn', 'tokenOut', 'amountIn', 'amountOutMin', 'to'],
          properties: {
            tokenIn: { type: 'string' },
            tokenOut: { type: 'string' },
            amountIn: { type: 'string' },
            amountOutMin: { type: 'string' },
            to: { type: 'string' },
            deadline: { type: 'number' },
          },
        },
      },
    },
    controller.swap.bind(controller)
  );

  // Add liquidity
  fastify.post<{ Body: LiquidityParams }>(
    '/liquidity/add',
    {
      schema: {
        body: {
          type: 'object',
          required: [
            'tokenA',
            'tokenB',
            'amountADesired',
            'amountBDesired',
            'amountAMin',
            'amountBMin',
            'to',
          ],
          properties: {
            tokenA: { type: 'string' },
            tokenB: { type: 'string' },
            amountADesired: { type: 'string' },
            amountBDesired: { type: 'string' },
            amountAMin: { type: 'string' },
            amountBMin: { type: 'string' },
            to: { type: 'string' },
            deadline: { type: 'number' },
          },
        },
      },
    },
    controller.addLiquidity.bind(controller)
  );

  // Get amounts out
  fastify.get<{ Params: { amountIn: string; path: string[] } }>(
    '/amounts/out/:amountIn/:path',
    {
      schema: {
        params: {
          type: 'object',
          required: ['amountIn', 'path'],
          properties: {
            amountIn: { type: 'string' },
            path: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    controller.getAmountsOut.bind(controller)
  );

  // Get amounts in
  fastify.get<{ Params: { amountOut: string; path: string[] } }>(
    '/amounts/in/:amountOut/:path',
    {
      schema: {
        params: {
          type: 'object',
          required: ['amountOut', 'path'],
          properties: {
            amountOut: { type: 'string' },
            path: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    controller.getAmountsIn.bind(controller)
  );
} 