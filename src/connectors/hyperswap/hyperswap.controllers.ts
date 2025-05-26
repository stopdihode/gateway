import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { HyperswapConnector } from './hyperswap';
import { SwapParams, LiquidityParams } from './types';

export class HyperswapController {
  private connector: HyperswapConnector;

  constructor(connector: HyperswapConnector) {
    this.connector = connector;
  }

  async getPoolInfo(
    request: FastifyRequest<{ Params: { tokenA: string; tokenB: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { tokenA, tokenB } = request.params;
      const poolInfo = await this.connector.getPoolInfo(tokenA, tokenB);
      return reply.send(poolInfo);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async swap(
    request: FastifyRequest<{ Body: SwapParams }>,
    reply: FastifyReply
  ) {
    try {
      const swapParams = request.body;
      const result = await this.connector.swap(swapParams);
      return reply.send(result);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async addLiquidity(
    request: FastifyRequest<{ Body: LiquidityParams }>,
    reply: FastifyReply
  ) {
    try {
      const liquidityParams = request.body;
      const result = await this.connector.addLiquidity(liquidityParams);
      return reply.send(result);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async getAmountsOut(
    request: FastifyRequest<{
      Params: { amountIn: string; path: string[] };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { amountIn, path } = request.params;
      const amounts = await this.connector.getAmountsOut(amountIn, path);
      return reply.send(amounts);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }

  async getAmountsIn(
    request: FastifyRequest<{
      Params: { amountOut: string; path: string[] };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { amountOut, path } = request.params;
      const amounts = await this.connector.getAmountsIn(amountOut, path);
      return reply.send(amounts);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }
} 