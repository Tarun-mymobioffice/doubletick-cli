import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient, handleApiError } from '../api/client';
import { promptComment } from '../prompts/comment.prompts';

interface GlobalOpts {
  json?: boolean;
  key?: string;
  baseUrl?: string;
}

export function registerCommentCommands(program: Command): void {
  const comment = program.command('comment').description('Manage task comments');

  comment
    .command('add')
    .description('Add a comment to a task')
    .option('--task-id <id>', 'Task ID')
    .option('--json', 'Output raw JSON')
    .option('--key <key>', 'Override secret key')
    .option('--base-url <url>', 'Override base URL')
    .action(async (opts: GlobalOpts & { taskId?: string }) => {
      const answers = await promptComment(opts.taskId);

      if (isNaN(answers.taskId)) {
        console.error(chalk.red('Task ID must be a valid number.'));
        process.exit(1);
      }

      const commentHtml = `<p>${answers.commentText}</p>`;

      const payload = {
        IsActive: true,
        TaskComment: {
          IsActive: true,
          TaskID: answers.taskId,
          CommentText: answers.commentText,
          CommentHtml: commentHtml,
          MentionIds: answers.mentionIds,
          ExternalFrom: '',
          IsIncoming: false,
          IsPrivate: answers.isPrivate,
          IsSentAsWhatsapp: answers.isSentAsWhatsapp,
        },
      };

      const client = createClient({ key: opts.key, baseUrl: opts.baseUrl });
      const spinner = ora('Adding comment...').start();

      try {
        const res = await client.post('/api/task/InsertTaskComment', payload);
        spinner.succeed(chalk.green('Comment added successfully.'));

        if (opts.json) {
          console.log(JSON.stringify(res.data, null, 2));
        }
      } catch (err) {
        spinner.fail('Failed to add comment.');
        handleApiError(err);
      }
    });
}
