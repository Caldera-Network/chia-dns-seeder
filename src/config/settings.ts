import { NetworkScannerOptions } from '@caldera-network/chia-network-scanner/dist/lib/utils/options';

export const settings: NetworkScannerOptions = {
    network: {
        networkId: 'testnet5',
        protocolVersion: '0.0.32',
        softwareVersion: '0.1.dev4711', // 1.1.73
    },
    certPath: '/root/.caldera/mainnet/config/ssl/ca/caldera_ca.crt',
    keyPath: '/root/.caldera/mainnet/config/ssl/ca/caldera_ca.key',
    peer: {
        nodeType: 1,
    },
    connectionTimeout: 2500,
    concurrency: 50,
    startNodes: [
        { hostname: '46.101.240.134', port: 8620 }, // fullnode-01
        { hostname: '138.197.190.33', port: 8620 }, // fullnode-02
        { hostname: '51.159.31.172', port: 8620 }, // timelord-01
    ],
};
