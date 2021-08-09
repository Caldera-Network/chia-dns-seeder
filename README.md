# DNS Seeder

Routlinely scans a Chia Blockchain Algorithm Network and stores data in Cloudflare, allowing Chia forks to increase stability and futureproof their blockchains by utilizing DNS Seeders.

## Donate

[Coinbase](https://commerce.coinbase.com/checkout/5ed151a5-4d24-4dd9-9d1e-8f31648dd271)

XCH: `xch1jhp9n6h30qmqjknmldd3y4948325npfkfs6f7jn8v3u8cgw5ykks9zlvae`

## Usage

### Install

1. `npm i -g @caldera-network/dns-seeder`

### Commands
| Name              | Description |
|:---               | :---        |
| `dns-seeder start` | Executes The Scan & Upload |
| `dns-seeder setup` | Displays Config FilePath |


## Configuration

### Cloudflare API Token & Zone ID (Pick One)

1. Config File
    - `apiToken`
    - `zoneId`
1. Environment Variables
    - `CLOUDFLARE_TOKEN`
    - `CLOUDFLARE_ZONE`
1. `dns-seeder start --apiToken <API Token> --zoneId <Zone ID>`

- API Token
    - Create a token on your profile (https://dash.cloudflare.com/profile/api-tokens)
    - Permissions of `Edit zone DNS` with at least one Zone Resource
- Zone ID
    - Must be included in your API Token's Zone Resources
    - Can be found at the bottom right of your websites' cloudflare dashboard (`https://dash.cloudflare.com/\<Account ID\>/\<Domain\>`)

### [Network Scanner](https://github.com/Caldera-Network/chia-network-scanner#usage)

| Key              | Description |
|:---               | :---        |
| `networkId` | e.g. `mainnet` or `testnet7` |
| `startNodes` | Array of reliable nodes to start from |
| `connectionTimeout` | Used to timeout on various operations such as handshake |
| `concurrency` | Number of peers to scan concurrently. Bigger is faster but uses more sockets and memory |
| `keyPath` | Full node public key |
| `certPath` | Full node public cert |

---

### Default Config
```
{
    cloudflare: {
        apiToken: '',
        zoneId: '',
    },
    startNodes: [
        { hostname: '1.1.1.1', port: 8620 },
        { hostname: '2.2.2.2', port: 8620 },
        { hostname: '3.3.3.3', port: 8620 },
    ],
    network: {
        networkId: 'mainnet',
        protocolVersion: '0.0.0',
        softwareVersion: '0.0.0',
    },
    peer: {
        nodeType: 1,
    },
    connectionTimeout: 2500,
    concurrency: 50,
    certPath: '/root/.caldera/mainnet/config/ssl/ca/caldera_ca.crt',
    keyPath: '/root/.caldera/mainnet/config/ssl/ca/caldera_ca.key',
}
```
