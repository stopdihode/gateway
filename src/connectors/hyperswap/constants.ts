export const ROUTER_ADDRESS = '0xD19222370B1944a5392f98028C3E70AFD3a673dF';

export const DEFAULT_SLIPPAGE = 0.5; // 0.5%
export const DEFAULT_DEADLINE = 20 * 60; // 20 minutes

export const NATIVE_TOKEN = {
  symbol: 'HYPE',
  decimals: 18,
  name: 'HyperEVM',
};

export const SUPPORTED_TOKENS = {
  USDC: {
    address: '0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  WETH: {
    address: '0xADcb2f358Eae6492F61A5F87eb8893d09391d160',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
  },
};

export const FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: Replace with actual factory address 