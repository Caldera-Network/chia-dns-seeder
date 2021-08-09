#!/usr/bin/env node
import { Command } from 'commander';
import { DNSSeeder } from '../lib/seeder/seeder';
import updateNotifier from 'update-notifier';
import { config } from 'src/lib/utils/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../../package.json';
import { NetworkScannerOptions } from '@caldera-network/chia-network-scanner/dist/lib/utils/options';

updateNotifier({
    pkg,
    updateCheckInterval: 0,
}).notify();

const dnsSeeder = new Command();
dnsSeeder
    .version(pkg.version)
    .option('-t, --apiToken <apiToken>', 'Cloudflare API Token')
    .option('-z, --zoneId <zoneId>', 'Cloudflare Zone ID')
    .description('')
    .action(async () => {
        /* DNS Seeder Options */
        const networkOptions = {
            certPath: config.get('certPath'),
            concurrency: config.get('concurrency'),
            connectionTimeout: config.get('connectionTimeout'),
            keyPath: config.get('keyPath'),
            network: config.get('network'),
            peer: config.get('peer'),
            startNodes: config.get('startNodes'),
        } as NetworkScannerOptions;

        /* Cloudflare Constants */
        const token =
            process.env.CLOUDFLARE_TOKEN ||
            config.get('cloudflare.apiToken') ||
            '';
        const zoneId =
            process.env.CLOUDFLARE_ZONE ||
            config.get('cloudflare.zoneId') ||
            '';

        if (token === '') {
            console.error(
                `Token is undefined, please pass in a 'CLOUDFLARE_TOKEN' or update the '${config.path}' file`
            );
            process.exit(1);
        }
        if (zoneId === '') {
            console.error(
                `Zone is undefined, please pass in a 'CLOUDFLARE_ZONE' or update the '${config.path}' file`
            );
            process.exit(1);
        }
        if (networkOptions?.network?.protocolVersion === '0.0.0') {
            console.error(
                `Protocol Version is '0.0.0', please update the '${config.path}' file`
            );
            process.exit(1);
        }

        const dnsSeeder = new DNSSeeder(token, zoneId, networkOptions);
        dnsSeeder.execute();
    });

dnsSeeder.parse(process.argv);
const options = dnsSeeder.opts();
if (options.token) process.env.CLOUDFLARE_TOKEN = options.token;
if (options.zone) process.env.CLOUDFLARE_ZONE = options.zone;
