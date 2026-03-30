
```
 ________  _________        ________  ___       ___
|\   ___ \|\___   ___\     |\   ____\|\  \     |\  \
\ \  \_|\ \|___ \  \_|     \ \  \___|\ \  \    \ \  \
 \ \  \ \\ \   \ \  \       \ \  \    \ \  \    \ \  \
  \ \  \_\\ \   \ \  \       \ \  \____\ \  \____\ \  \
   \ \_______\   \ \__\       \ \_______\ \_______\ \__\
    \|_______|    \|__|        \|_______|\|_______|\|__|

           mobioffice-dt-cli  v1.2.0
    DoubleTick Task Management — Terminal Edition
    Built by MobiOffice  ·  Node.js  ·  TypeScript
```

---

## What is `dt`?

`dt` is a **command-line interface** for the [DoubleTick Task Management](https://prod-api.task-management.mobioffice.io) platform by **MobiOffice**.
Stop switching browser tabs — get, update, and comment on tasks without ever leaving your terminal.

```bash
dt auth set                             # save your secret key
dt task get --id in-demo/122            # fetch & pretty-print a task
dt task update-heading --id 109006      # update title & description
dt task update-main --id 109006         # update status / workspace
dt comment add --task-id 109006         # add a comment
```

---

## Requirements

| Tool    | Version |
|---------|---------|
| Node.js | ≥ 18.x  |
| npm     | ≥ 9.x   |

---

## Installation

### From source

```bash
git clone https://github.com/mobioffice/dt-cli.git
cd dt-cli
npm install
npm run build
npm link          # registers `dt` as a global binary
```

### Without linking (local use)

```bash
node dist/index.js <command>
```

### Via npx (no install)

```bash
npx . <command>
```

---

## First-time Setup

Before running any command you must save your **secret key**:

```bash
dt auth set
```

```
? Enter your secret key: ****************
? Base URL (press Enter to keep default): https://prod-api.task-management.mobioffice.io
✔ Secret key saved successfully.
  Base URL: https://prod-api.task-management.mobioffice.io
```

Credentials are stored at:

| OS | Path |
|----|------|
| Windows | `%APPDATA%\dt-cli\config.json` |
| macOS / Linux | `~/.config/dt-cli/config.json` |

---

## Commands

### `dt auth set`

Interactively save your secret key (and optionally a custom base URL).

```bash
dt auth set
```

```
? Enter your secret key:  ****************
? Base URL (press Enter to keep default):  https://prod-api.task-management.mobioffice.io
✔ Secret key saved successfully.
```

---

### `dt task get`

Fetch and pretty-print full details of a task.

```bash
dt task get --id in-demo/122
```

**Sample output:**

```
✔ Task fetched.

  Task Details
──────────────────────────────────────────────────
  ID             in-demo/122
  TaskID         107139
  Title          Requirement: Ticket collector (15 Yrs)
  Status         JD Approval
  Priority       Medium
  Workspace      Demo (in-demo)
  Project        Job Description
  Flow           Recruitment Request
  Assignee       Tarun chelumalla <tarun.chelumalla@mymobioffice.com>
  Reporter       Tarun chelumalla
  Active         Yes
  Start Date     3/20/2026, 11:49:16 AM
  End Date       3/20/2026, 11:49:16 AM
  Created At     3/26/2026, 9:25:22 AM
  Updated At     3/26/2026, 11:10:08 AM
──────────────────────────────────────────────────
  Description
    Title: Ticket collector  Min Exp: 15
    Overview: Have a ticket guy exp
```

**Options:**

| Flag | Description |
|------|-------------|
| `--id <id>` | Task display ID, e.g. `in-demo/122`. Prompted if omitted. |
| `--json` | Print raw API JSON instead of pretty view |
| `--key <key>` | Override saved secret key for this call |
| `--base-url <url>` | Override saved base URL for this call |

---

### `dt task update-heading`

Update a task's **title** and **description**.

```bash
dt task update-heading --id 109006
```

Interactive prompts:

```
? Task ID:  109006
? Title:  Updated Task Title
? Description (plain text):  Updated description here
```

> `DescriptionHtml` is auto-generated as:
> `<html><head></head><body><p>Updated description here</p></body></html>`

**API:**
```
PUT /api/task/UpdateTaskHeadingDescription?TaskID=109006
```

**Payload sent:**
```json
{
  "TaskID": 109006,
  "Title": "Updated Task Title",
  "DescriptionText": "Updated description here",
  "DescriptionHtml": "<html><head></head><body><p>Updated description here</p></body></html>"
}
```

**Response:**
```json
{ "IsSuccess": true, "Message": "Task created successfully", "TaskID": 109006 }
```

**Options:**

| Flag | Description |
|------|-------------|
| `--id <id>` | Numeric task ID. Prompted if omitted. |
| `--json` | Print raw API JSON |
| `--key <key>` | Override secret key |
| `--base-url <url>` | Override base URL |

---

### `dt task update-main`

Update a task's **status**, **workspace**, and **active** state.

```bash
dt task update-main --id 109006
```

Interactive prompts:

```
? Task ID:  109006
? Workspace ID:  5
? Status ID:  1
? Is Active? (Y/n):  Y
? Additional Task IDs (comma-separated, or leave blank):
```

**API:**
```
PUT /api/task/UpdateTaskMain
```

**Payload sent:**
```json
{
  "IsActive": true,
  "TaskIds": [],
  "StatusID": 1,
  "TaskID": 109006,
  "WorkspaceID": 5
}
```

**Response:**
```json
{ "IsSuccess": true, "Message": "Task updated successfully", "TaskID": 109006 }
```

**Options:**

| Flag | Description |
|------|-------------|
| `--id <id>` | Numeric task ID. Prompted if omitted. |
| `--json` | Print raw API JSON |
| `--key <key>` | Override secret key |
| `--base-url <url>` | Override base URL |

---

### `dt comment add`

Add a comment to a task, with optional user mentions, privacy, and WhatsApp delivery.

```bash
dt comment add --task-id 109006
```

Interactive prompts:

```
? Task ID:  109006
? Comment text:  Approved and moving forward.
? Mention user IDs (comma-separated, or leave blank):  1
? Private comment? (y/N):  N
? Send as WhatsApp? (y/N):  N
```

> `CommentHtml` is auto-generated as `<p>Approved and moving forward.</p>`

**API:**
```
POST /api/task/InsertTaskComment
```

**Payload sent:**
```json
{
  "IsActive": true,
  "TaskComment": {
    "IsActive": true,
    "TaskID": 109006,
    "CommentText": "Approved and moving forward.",
    "CommentHtml": "<p>Approved and moving forward.</p>",
    "MentionIds": [1],
    "ExternalFrom": "",
    "IsIncoming": false,
    "IsPrivate": false,
    "IsSentAsWhatsapp": false
  }
}
```

**Response:**
```json
{ "IsSuccess": true, "Message": "Comment added successfully", "CommentID": 48321 }
```

**Options:**

| Flag | Description |
|------|-------------|
| `--task-id <id>` | Numeric task ID. Prompted if omitted. |
| `--json` | Print raw API JSON |
| `--key <key>` | Override secret key |
| `--base-url <url>` | Override base URL |

---

## Global Flags

Every command supports these flags:

| Flag | Description |
|------|-------------|
| `--json` | Skip pretty-print, output raw JSON (great for piping / scripting) |
| `--key <key>` | Use this secret key instead of the saved config value |
| `--base-url <url>` | Use this base URL instead of the saved config value |

### Power-user examples

```bash
# Override key for a one-off call
dt task get --id in-demo/122 --key sk_prod_abc123

# Point to a staging server
dt task update-main --id 109006 --base-url https://staging-api.mobioffice.io

# Pipe JSON output into jq for scripting
dt task get --id in-demo/122 --json | jq '.Title'

# Save raw response to a file
dt task get --id in-demo/122 --json > task-109006.json

# Chain: fetch then update heading in one shot
dt task get --id in-demo/122 --json | jq -r '.TaskID'
```

---

## API Reference

| Command | Method | Endpoint |
|---------|--------|----------|
| `dt task get` | `GET` | `/api/task/GetTaskMainByID?task_id={id}` |
| `dt task update-heading` | `PUT` | `/api/task/UpdateTaskHeadingDescription?TaskID={id}` |
| `dt task update-main` | `PUT` | `/api/task/UpdateTaskMain` |
| `dt comment add` | `POST` | `/api/task/InsertTaskComment` |

**Auth header sent on every request:**
```
secret-key: <your-secret-key>
```

---

## Project Structure

```
dt-cli/
├── src/
│   ├── index.ts                   # Entry point — commander setup
│   ├── config.ts                  # Conf-based key/URL persistent storage
│   ├── api/
│   │   └── client.ts              # Axios factory + error handler
│   ├── commands/
│   │   ├── auth.ts                # dt auth set
│   │   ├── task.ts                # dt task get / update-heading / update-main
│   │   └── comment.ts             # dt comment add
│   ├── prompts/
│   │   ├── task.prompts.ts        # Inquirer prompts for task commands
│   │   └── comment.prompts.ts     # Inquirer prompts for comment commands
│   └── utils/
│       └── stripHtml.ts           # Strips HTML tags from DescriptionText
├── dist/                          # Compiled JS output (auto-generated)
├── package.json
└── tsconfig.json
```

---

## Development

```bash
# Run directly without a build step
npm run dev -- task get --id in-demo/122

# Compile TypeScript → dist/
npm run build

# Run the compiled output
npm start -- task get --id in-demo/122
```

---

## License

MIT © MobiOffice
