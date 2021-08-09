import { DNSSeeder } from './lib/seeder/seeder';

require('dotenv').config()

const token = process.env.CLOUDFLARE_TOKEN || '';
const zoneId = process.env.CLOUDFLARE_ZONE || '';

if (token === '') {
    console.error(
        `Token is undefined, please pass in a 'CLOUDFLARE_TOKEN' or update the '.env' file`
    );
    process.exit(1);
}
if (zoneId === '') {
    console.error(
        `Zone is undefined, please pass in a 'CLOUDFLARE_ZONE' or update the '.env' file`
    );
    process.exit(1);
}

const dnsSeeder = new DNSSeeder(token, zoneId);
dnsSeeder.execute();
