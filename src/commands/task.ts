import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createClient, handleApiError } from "../api/client";
import {
  promptTaskId,
  promptUpdateHeading,
  promptUpdateMain,
} from "../prompts/task.prompts";
import { stripHtml } from "../utils/stripHtml";

interface GlobalOpts {
  json?: boolean;
  key?: string;
  baseUrl?: string;
}

/** Shape returned by GET /api/task/GetTaskMainByID */
interface TaskResponse {
  TaskID: number;
  DisplayTaskID: number;
  FullDisplayTaskID: string;
  Title: string;
  StatusName: string;
  StatusID: number;
  PriorityName: string;
  WorkspaceName: string;
  WorkspaceCode: string;
  ProjectName: string;
  FlowName: string;
  AssigneeName: string;
  AssigneeEmailID: string;
  ReporterName: string;
  DescriptionText: string;
  StartDate: string | null;
  EndDate: string | null;
  IsActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleString();
}

function printTask(t: TaskResponse): void {
  const divider = chalk.gray("─".repeat(50));
  const label = (text: string) => chalk.cyan(text.padEnd(14));

  console.log("");
  console.log(chalk.bold.white("  Task Details"));
  console.log(divider);
  console.log(
    `  ${label("ID")} ${chalk.yellow(t.FullDisplayTaskID ?? t.TaskID)}`,
  );
  console.log(`  ${label("TaskID")} ${chalk.yellow(t.TaskID)}`);
  console.log(`  ${label("Title")} ${t.Title ?? "N/A"}`);
  console.log(
    `  ${label("Status")} ${chalk.green(t.StatusName ?? t.StatusID ?? "N/A")}`,
  );
  console.log(`  ${label("Priority")} ${t.PriorityName ?? "N/A"}`);
  console.log(
    `  ${label("Workspace")} ${t.WorkspaceName ?? "N/A"}${t.WorkspaceCode ? chalk.gray(` (${t.WorkspaceCode})`) : ""}`,
  );
  console.log(`  ${label("Project")} ${t.ProjectName ?? "N/A"}`);
  console.log(`  ${label("Flow")} ${t.FlowName ?? "N/A"}`);
  console.log(
    `  ${label("Assignee")} ${t.AssigneeName ?? "N/A"}${t.AssigneeEmailID ? chalk.gray(` <${t.AssigneeEmailID}>`) : ""}`,
  );
  console.log(`  ${label("Reporter")} ${t.ReporterName ?? "N/A"}`);
  console.log(
    `  ${label("Active")} ${t.IsActive ? chalk.green("Yes") : chalk.red("No")}`,
  );
  console.log(`  ${label("Start Date")} ${formatDate(t.StartDate)}`);
  console.log(`  ${label("End Date")} ${formatDate(t.EndDate)}`);
  console.log(`  ${label("Created At")} ${formatDate(t.createdAt)}`);
  console.log(`  ${label("Updated At")} ${formatDate(t.updatedAt)}`);
  console.log(divider);

  const desc = t.DescriptionText ? stripHtml(t.DescriptionText) : "N/A";
  if (desc && desc !== "N/A") {
    console.log(`  ${chalk.cyan("Description")}`);
    // word-wrap at ~60 chars
    const words = desc.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      if ((line + " " + word).trim().length > 60) {
        if (line) lines.push(line.trim());
        line = word;
      } else {
        line = (line + " " + word).trim();
      }
    }
    if (line) lines.push(line.trim());
    lines.forEach((l) => console.log(`    ${l}`));
  }

  console.log("");
}

export function registerTaskCommands(program: Command): void {
  const task = program.command("task").description("Manage tasks");

  // ── dt task get ──────────────────────────────────────────────
  task
    .command("get")
    .description("Get task details by ID")
    .option("--id <id>", "Task ID (e.g. in-demo/122)")
    .option("--json", "Output raw JSON")
    .option("--key <key>", "Override secret key")
    .option("--base-url <url>", "Override base URL")
    .action(async (opts: GlobalOpts & { id?: string }) => {
      const taskId = await promptTaskId(opts.id);
      const client = createClient({ key: opts.key, baseUrl: opts.baseUrl });
      const spinner = ora("Fetching task...").start();

      try {
        const res = await client.get<{ Table: TaskResponse }>(
          "/api/task/GetTaskMainByID",
          {
            params: { task_id: taskId },
          },
        );
        spinner.succeed("Task fetched.");

        if (opts.json) {
          console.log(JSON.stringify(res.data, null, 2));
          return;
        }

        printTask(res.data.Table);
      } catch (err) {
        spinner.fail("Failed to fetch task.");
        handleApiError(err);
      }
    });

  // ── dt task update-heading ────────────────────────────────────
  task
    .command("update-heading")
    .description("Update task title and description")
    .option("--id <id>", "Task ID (numeric)")
    .option("--json", "Output raw JSON")
    .option("--key <key>", "Override secret key")
    .option("--base-url <url>", "Override base URL")
    .action(async (opts: GlobalOpts & { id?: string }) => {
      const taskIdStr = await promptTaskId(opts.id);
      const taskId = parseInt(taskIdStr, 10);

      if (isNaN(taskId)) {
        console.error(
          chalk.red("Task ID must be a number for update-heading."),
        );
        process.exit(1);
      }

      const answers = await promptUpdateHeading();
      const descriptionHtml = `<html><head></head><body><p>${answers.descriptionText}</p></body></html>`;

      const payload = {
        TaskID: taskId,
        Title: answers.title,
        DescriptionText: answers.descriptionText,
        DescriptionHtml: descriptionHtml,
      };

      const client = createClient({ key: opts.key, baseUrl: opts.baseUrl });
      const spinner = ora("Updating task heading...").start();

      try {
        const res = await client.put(
          `/api/task/UpdateTaskHeadingDescription?TaskID=${taskId}`,
          payload,
        );
        spinner.succeed(chalk.green("Task heading updated successfully."));

        if (opts.json) {
          console.log(JSON.stringify(res.data, null, 2));
          return;
        }

        const d = res.data as {
          IsSuccess?: boolean;
          Message?: string;
          TaskID?: number;
        };
        console.log("");
        console.log(`  ${chalk.cyan("Task ID:")}  ${d?.TaskID ?? taskId}`);
        console.log(`  ${chalk.cyan("Message:")}  ${d?.Message ?? "Done"}`);
        console.log("");
      } catch (err) {
        spinner.fail("Failed to update task heading.");
        handleApiError(err);
      }
    });

  // ── dt task update-main ───────────────────────────────────────
  task
    .command("update-main")
    .description("Update task main fields (status, workspace, active state)")
    .option("--id <id>", "Task ID (numeric)")
    .option("--json", "Output raw JSON")
    .option("--key <key>", "Override secret key")
    .option("--base-url <url>", "Override base URL")
    .action(async (opts: GlobalOpts & { id?: string }) => {
      const taskIdStr = await promptTaskId(opts.id);
      const taskId = parseInt(taskIdStr, 10);

      if (isNaN(taskId)) {
        console.error(chalk.red("Task ID must be a number for update-main."));
        process.exit(1);
      }

      const answers = await promptUpdateMain();

      const payload = {
        IsActive: answers.isActive,
        TaskIds: answers.taskIds,
        StatusID: answers.statusId,
        TaskID: taskId,
        WorkspaceID: answers.workspaceId,
      };

      const client = createClient({ key: opts.key, baseUrl: opts.baseUrl });
      const spinner = ora("Updating task...").start();

      try {
        const res = await client.put("/api/task/UpdateTaskMain", payload);
        spinner.succeed(chalk.green("Task updated successfully."));

        if (opts.json) {
          console.log(JSON.stringify(res.data, null, 2));
          return;
        }

        const d = res.data as {
          IsSuccess?: boolean;
          Message?: string;
          TaskID?: number;
        };
        console.log("");
        console.log(`  ${chalk.cyan("Task ID:")}  ${d?.TaskID ?? taskId}`);
        console.log(`  ${chalk.cyan("Message:")}  ${d?.Message ?? "Done"}`);
        console.log("");
      } catch (err) {
        spinner.fail("Failed to update task.");
        handleApiError(err);
      }
    });
}
