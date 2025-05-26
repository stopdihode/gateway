import { Type } from '@sinclair/typebox';
import { AvailableNetworks } from '../connector.requests';
import { ConfigManagerV2 } from '../../services/config-manager-v2';

export const HyperswapConfigSchema = Type.Object({
  name: Type.String(),
  chain: Type.String(),
  network: Type.String(),
  tradingTypes: Type.Array(Type.String()),
  routerAddress: Type.String(),
  factoryAddress: Type.String(),
  supportedTokens: Type.Record(
    Type.String(),
    Type.Object({
      address: Type.String(),
      symbol: Type.String(),
      decimals: Type.Number(),
      name: Type.String(),
    })
  ),
});

export type HyperswapConfig = {
  name: string;
  chain: string;
  network: string;
  tradingTypes: string[];
  routerAddress: string;
  factoryAddress: string;
  supportedTokens: {
    [key: string]: {
      address: string;
      symbol: string;
      decimals: number;
      name: string;
    };
  };
};

export namespace HyperswapConfig {
  export interface NetworkConfig {
    allowedSlippage: string;
    gasLimitEstimate: number;
    ttl: number;
    maximumHops: number;
    availableNetworks: Array<AvailableNetworks>;
    contractAddresses: {
      [chain: string]: {
        [network: string]: {
          routerAddress: string;
          factoryAddress: string;
          quoterAddress: string;
        }
      }
    };
    routerAddress: (chain: string, network: string) => string;
    factoryAddress: (chain: string, network: string) => string;
    quoterAddress: (chain: string, network: string) => string;
  }

  export const config: NetworkConfig = {
    allowedSlippage: ConfigManagerV2.getInstance().get(
      'hyperswap.allowedSlippage'
    ),
    gasLimitEstimate: ConfigManagerV2.getInstance().get(
      'hyperswap.gasLimitEstimate'
    ),
    ttl: ConfigManagerV2.getInstance().get('hyperswap.ttl'),
    maximumHops: ConfigManagerV2.getInstance().get('hyperswap.maximumHops'),
    availableNetworks: [{
      chain: 'ethereum',
      networks: ['hyperevm']
    }],
    contractAddresses: ConfigManagerV2.getInstance().get('hyperswap.contractAddresses'),

    routerAddress: (chain: string, network: string): string => {
      return config.contractAddresses[chain][network].routerAddress;
    },
    factoryAddress: (chain: string, network: string): string => {
      return config.contractAddresses[chain][network].factoryAddress;
    },
    quoterAddress: (chain: string, network: string): string => {
      return config.contractAddresses[chain][network].quoterAddress;
    }
  };
} 