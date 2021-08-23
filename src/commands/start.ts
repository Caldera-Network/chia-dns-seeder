import { createCommand, OptionValues } from 'commander';
import { DNSSeeder } from '../lib/seeder/seeder';
import { dnsSeederConfig } from 'src/lib/utils/config';
import { NetworkScannerOptions } from '@caldera-network/chia-network-scanner';
import schedule from 'node-schedule';

export const startCommand = createCommand('start')
    .option('-t, --apiToken <apiToken>', 'Cloudflare API Token')
    .option('-z, --zoneId <zoneId>', 'Cloudflare Zone ID')
    .option('-ns, --no-scheduler', 'One-shot to run without schedule')
    .description('Executes The Scan & Upload')
    .action(async (options: OptionValues) => {
        /* Cloudflare Options */
        const useScheduler = options.scheduler;
        const token =
            process.env.CLOUDFLARE_TOKEN ||
            dnsSeederConfig.get('cloudflare.apiToken') ||
            '';
        const zoneId =
            process.env.CLOUDFLARE_ZONE ||
            dnsSeederConfig.get('cloudflare.zoneId') ||
            '';
        if (token === '') {
            console.error(
                `Token is undefined, please pass in a 'CLOUDFLARE_TOKEN' or update the '${dnsSeederConfig.path}' file`
            );
            process.exit(1);
        }
        if (zoneId === '') {
            console.error(
                `Zone is undefined, please pass in a 'CLOUDFLARE_ZONE' or update the '${dnsSeederConfig.path}' file`
            );
            process.exit(1);
        }

        /* DNS Seeder Options */
        const networkOptions = {
            certPath: dnsSeederConfig.get('certPath'),
            concurrency: dnsSeederConfig.get('concurrency'),
            connectionTimeout: dnsSeederConfig.get('connectionTimeout'),
            keyPath: dnsSeederConfig.get('keyPath'),
            network: dnsSeederConfig.get('network'),
            peer: dnsSeederConfig.get('peer'),
            startNodes: dnsSeederConfig.get('startNodes'),
        } as NetworkScannerOptions;
        if (networkOptions?.network?.protocolVersion === '0.0.0') {
            console.error(
                `Protocol Version is '0.0.0', please update the '${dnsSeederConfig.path}' file`
            );
            process.exit(1);
        }

        const dnsSeeder = new DNSSeeder(token, zoneId, networkOptions);

        if (useScheduler) {
            schedule.scheduleJob(dnsSeederConfig.get('schedule'), () => {
                dnsSeeder.execute();
            });
        } else {
            dnsSeeder.execute();
        }
    });
