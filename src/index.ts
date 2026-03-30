#!/usr/bin/env node

import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth';
import { registerTaskCommands } from './commands/task';
import { registerCommentCommands } from './commands/comment';

const program = new Command();

program
  .name('dt')
  .description('DoubleTick Task Management CLI')
  .version('1.0.0');

registerAuthCommands(program);
registerTaskCommands(program);
registerCommentCommands(program);

program.parse(process.argv);
