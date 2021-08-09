#!/usr/bin/env node
import { Command } from 'commander';
import { DNSSeeder } from '../lib/seeder/seeder';
import updateNotifier from 'update-notifier';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../../package.json';

updateNotifier({
    pkg,
    updateCheckInterval: 0,
}).notify();

const dnsSeeder = new Command();
dnsSeeder
    .version(pkg.version)
    .option('-t, --token <token>', 'Cloudflare API Token')
    .option('-z, --zone <zoneId>', 'Cloudflare Zone ID')
    .description('')
    .action(async () => {
        /* Cloudflare Constants */
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
    });

dnsSeeder.parse(process.argv);
const options = dnsSeeder.opts();
if (options.token) process.env.CLOUDFLARE_TOKEN = options.token;
if (options.zone) process.env.CLOUDFLARE_ZONE = options.zone;
