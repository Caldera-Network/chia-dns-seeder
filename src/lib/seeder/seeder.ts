import { ChiaNetworkScanner } from '@caldera-network/chia-network-scanner';
import { AxiosRequestConfig } from 'axios';
import cf, { DnsRecord } from 'cloudflare';
import { settings } from 'src/config/settings';
import { CloudFlareResults } from '../cloudflare/cloudflare.types';
import { axiosRequest, getCloudflareType } from '../utils/utils';

export class DNSSeeder {
    private chiaNetworkScanner: ChiaNetworkScanner;
    private cloudflare: cf;
    public constructor(
        private readonly token: string,
        private readonly zoneId: string
    ) {
        this.chiaNetworkScanner = new ChiaNetworkScanner(settings);
        this.cloudflare = new cf({
            token,
        });
    }

    public async execute() {
        const peers = await this.chiaNetworkScanner.scan();
        const reducedPeers: string[] = peers.reduce(
            (acc, curr) => [...acc, curr.hostname] as any, // TODO: Fix typing
            []
        ) as any;
        const cloudFlareResults = await this.getEntireDnsResultList();
        await this.peerHandling(reducedPeers, cloudFlareResults);
    }
    private async peerHandling(
        peers: string[],
        cloudFlareResults: CloudFlareResults[]
    ) {
        const alreadyInCloudflare: string[] = [];

        /** Remove From Cloudflare */
        cloudFlareResults.forEach((cloudFlareResult) => {
            if (peers.includes(cloudFlareResult.content)) {
                // Already in Cloudflare, remove from peers
                alreadyInCloudflare.push(cloudFlareResult.content);
            } else {
                // Not in Peer List, remove from cloudflare
                this.cloudflare.dnsRecords.del(
                    cloudFlareResult.zone_id,
                    cloudFlareResult.id
                );
            }
        });

        /** Add to Cloudflare */
        const cleanedPeers = peers.filter(
            (x) => !alreadyInCloudflare.includes(x)
        );
        this.cloudflareUpload(cleanedPeers);
    }
    private async getEntireDnsResultList(
        pageNo = 1
    ): Promise<CloudFlareResults[]> {
        const results = await this.getDnsResults(pageNo);
        if (results.length > 0) {
            return results.concat(
                await this.getEntireDnsResultList(pageNo + 1)
            );
        } else {
            return results;
        }
    }
    private async getDnsResults(page: number): Promise<CloudFlareResults[]> {
        const url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`;
        const config: AxiosRequestConfig = {
            method: 'GET',
            url,
            params: {
                name: 'dns-introducer.caldera.network',
                order: 'content',
                direction: 'asc',
                match: 'all',
                per_page: '100',
                page,
            },
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };

        const axiosResponse = await axiosRequest(config);
        return axiosResponse.data.result as CloudFlareResults[];
    }
    private async cloudflareUpload(peers: string[]) {
        const allPromises: Promise<any>[] = [];
        for (let i = 0; i < peers.length; i += 1) {
            const dnsRecord: DnsRecord = {
                content: peers[i],
                name: 'dns-introducer',
                type: getCloudflareType(peers[i]),
                ttl: 600,
                proxied: false,
            };
            allPromises.push(
                this.cloudflare.dnsRecords.add(this.zoneId, dnsRecord)
            );
        }
        await Promise.all(allPromises);
    }
}
