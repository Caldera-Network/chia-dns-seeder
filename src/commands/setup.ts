import { createCommand } from 'commander';
import { dnsSeederConfig } from 'src/lib/utils/config';

export const setupCommand = createCommand('setup')
    .description('Displays Config FilePath')
    .action(async () => {
        console.log(
            `Configuration has been created. Please update the file according to the readme (https://github.com/Caldera-Network/dns-seeder#configuration).\n${dnsSeederConfig.path}`
        );
    });
