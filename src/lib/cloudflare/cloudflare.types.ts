export interface CloudFlareResults {
    id: string;
    zone_id: string;
    zone_name: string;
    name: string;
    type: 'A' | 'AAAA';
    content: string;
    proxiable: boolean;
    proxied: boolean;
    ttl: number;
    locked: boolean;
}
