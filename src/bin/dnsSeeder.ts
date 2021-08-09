#!/usr/bin/env node
import { Command } from 'commander';
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
    .option('-t, --apiToken <apiToken>', 'Cloudflare API Token')
    .option('-z, --zoneId <zoneId>', 'Cloudflare Zone ID')
    .description('')
    .action(async () => {
        dnsSeeder.outputHelp();
    });

dnsSeeder.parse(process.argv);
const options = dnsSeeder.opts();
if (options.apiToken) process.env.CLOUDFLARE_TOKEN = options.apiToken;
if (options.zoneId) process.env.CLOUDFLARE_ZONE = options.zoneId;
