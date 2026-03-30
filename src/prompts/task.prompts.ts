import inquirer from 'inquirer';

export async function promptTaskId(providedId?: string): Promise<string> {
  if (providedId) return providedId;
  const { taskId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'taskId',
      message: 'Task ID:',
      validate: (v: string) => v.trim().length > 0 || 'Task ID is required.',
    },
  ]);
  return taskId.trim();
}

export interface UpdateHeadingAnswers {
  title: string;
  descriptionText: string;
}

export async function promptUpdateHeading(): Promise<UpdateHeadingAnswers> {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Title:',
      validate: (v: string) => v.trim().length > 0 || 'Title is required.',
    },
    {
      type: 'input',
      name: 'descriptionText',
      message: 'Description (plain text):',
    },
  ]);
}

export interface UpdateMainAnswers {
  workspaceId: number;
  statusId: number;
  isActive: boolean;
  taskIds: number[];
}

export async function promptUpdateMain(): Promise<UpdateMainAnswers> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'workspaceId',
      message: 'Workspace ID:',
      validate: (v: string) => /^\d+$/.test(v.trim()) || 'Must be a number.',
    },
    {
      type: 'input',
      name: 'statusId',
      message: 'Status ID:',
      validate: (v: string) => /^\d+$/.test(v.trim()) || 'Must be a number.',
    },
    {
      type: 'confirm',
      name: 'isActive',
      message: 'Is Active?',
      default: true,
    },
    {
      type: 'input',
      name: 'taskIdsRaw',
      message: 'Additional Task IDs (comma-separated, or leave blank):',
      default: '',
    },
  ]);

  return {
    workspaceId: parseInt(answers.workspaceId, 10),
    statusId: parseInt(answers.statusId, 10),
    isActive: answers.isActive,
    taskIds: answers.taskIdsRaw
      ? answers.taskIdsRaw
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => /^\d+$/.test(s))
          .map((s: string) => parseInt(s, 10))
      : [],
  };
}
