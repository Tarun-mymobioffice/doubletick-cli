import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { setSecretKey, setBaseUrl, getBaseUrl, DEFAULT_BASE_URL } from '../config';

export function registerAuthCommands(program: Command): void {
  const auth = program.command('auth').description('Manage authentication');

  auth
    .command('set')
    .description('Set your DoubleTick secret key')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'secretKey',
          message: 'Enter your secret key:',
          mask: '*',
          validate: (input: string) =>
            input.trim().length > 0 ? true : 'Secret key cannot be empty.',
        },
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Base URL (press Enter to keep default):',
          default: getBaseUrl() || DEFAULT_BASE_URL,
        },
      ]);

      setSecretKey(answers.secretKey.trim());
      setBaseUrl(answers.baseUrl.trim());

      console.log(chalk.green('✔ Secret key saved successfully.'));
      console.log(chalk.gray(`  Base URL: ${answers.baseUrl.trim()}`));
    });
}
