import inquirer from 'inquirer';

export interface CommentAnswers {
  taskId: number;
  commentText: string;
  mentionIds: number[];
  isPrivate: boolean;
  isSentAsWhatsapp: boolean;
}

export async function promptComment(providedTaskId?: string): Promise<CommentAnswers> {
  const questions: inquirer.QuestionCollection[] = [];

  if (!providedTaskId) {
    questions.push({
      type: 'input',
      name: 'taskId',
      message: 'Task ID:',
      validate: (v: string) => /^\d+$/.test(v.trim()) || 'Must be a number.',
    });
  }

  questions.push(
    {
      type: 'input',
      name: 'commentText',
      message: 'Comment text:',
      validate: (v: string) => v.trim().length > 0 || 'Comment cannot be empty.',
    },
    {
      type: 'input',
      name: 'mentionIdsRaw',
      message: 'Mention user IDs (comma-separated, or leave blank):',
      default: '',
    },
    {
      type: 'confirm',
      name: 'isPrivate',
      message: 'Private comment?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'isSentAsWhatsapp',
      message: 'Send as WhatsApp?',
      default: false,
    },
  );

  const answers = await inquirer.prompt(questions as inquirer.QuestionCollection);

  return {
    taskId: providedTaskId
      ? parseInt(providedTaskId, 10)
      : parseInt(answers.taskId, 10),
    commentText: answers.commentText.trim(),
    mentionIds: answers.mentionIdsRaw
      ? answers.mentionIdsRaw
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => /^\d+$/.test(s))
          .map((s: string) => parseInt(s, 10))
      : [],
    isPrivate: answers.isPrivate,
    isSentAsWhatsapp: answers.isSentAsWhatsapp,
  };
}
