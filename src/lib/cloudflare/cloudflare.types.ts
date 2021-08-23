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

type RecordTypes =
    | 'A'
    | 'AAAA'
    | 'CNAME'
    | 'HTTPS'
    | 'TXT'
    | 'SRV'
    | 'LOC'
    | 'MX'
    | 'NS'
    | 'SPF'
    | 'CERT'
    | 'DNSKEY'
    | 'DS'
    | 'NAPTR'
    | 'SMIMEA'
    | 'SSHFP'
    | 'SVCB'
    | 'TLSA'
    | 'URI read only';

interface DnsRecordWithoutPriority {
    type: Exclude<RecordTypes, 'MX' | 'SRV' | 'URI'>;
    name: string;
    content: string;
    ttl: number;
    proxied?: boolean | undefined;
}

interface DnsRecordWithPriority {
    type: Exclude<RecordTypes, 'MX' | 'SRV' | 'URI'>;
    name: string;
    content: string;
    ttl: number;
    proxied?: boolean | undefined;
    priority: number;
}

interface SrvDnsRecord {
    type: 'SRV';
    data: {
        name: string;
        service: string;
        proto: string;
        ttl: number;
        proxied?: boolean | undefined;
        priority: number;
        weight: number;
        port: number;
        target: string;
    };
}

export type DnsRecord =
    | DnsRecordWithPriority
    | DnsRecordWithoutPriority
    | SrvDnsRecord;
