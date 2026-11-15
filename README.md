# MentorMeet

MentorMeet is a React application for scheduling technical mentor (TM) sessions in a software development bootcamp. It uses JSON Server as a mock REST API to store mentors and appointments in `db.json`.

## Features

- Choose a date from a calendar; past dates and weekends (Saturday and Sunday) are unavailable.
- Select one of three technical mentors.
- Book a morning session (7:00 AM) or afternoon session (3:00 PM).
- See whether a slot is available or already booked, including the student's name and discussion topic.
- View upcoming appointments.
- Mentor and appointment data are fetched from JSON Server rather than browser localStorage.

> Search/filter, edit, and delete controls may be added as follow-up features. Do not assume they are present until their changes are merged into the repository.

## Requirements

- Node.js and npm (use a current Node.js LTS release)
- Git
- A code editor such as VS Code

## Clone and run locally

```bash
git clone https://github.com/makerjose/mentor-meet.git
cd mentor-meet
npm install
npm run dev:all
```

The development script starts:

- **React/Vite:** http://localhost:5173
- **JSON Server:** http://localhost:3001
- **Mentors endpoint:** http://localhost:3001/mentors
- **Appointments endpoint:** http://localhost:3001/appointments

Alternatively, open two terminals in the project directory:

```bash
# Terminal 1: mock API
npm run server

# Terminal 2: React frontend
npm run dev
```

## Team contribution workflow

**Do not commit or push directly to `main`.** Each contributor must create a personal feature branch named `ft-membername` before making commits.

### 1. Start from the latest dev branch

```bash
git switch dev
git pull origin dev
```

### 2. Create and switch to your branch

Replace `membername` with your name, for example `ft-daniel`:

```bash
git switch -c ft-membername
```

Confirm which branch you are on:

```bash
git branch --show-current 
Alternatively 
git branch
```

The output must be `ft-membername` (with your actual name), **not** `main` or `dev`.

If your branch already exists locally, use `git switch ft-membername` instead of creating it again.

### 3. Make changes, commit, and push

```bash
git status
git add .
git commit -m "feat: describe your contribution"
git push -u origin ft-membername
```

For later pushes on the same branch, `git push` is sufficient.

### 4. Open a pull request

On GitHub, open a Pull Request with:

- **Base:** `dev`
- **Compare:** `ft-membername`

Describe what changed, request a teammate's review before merging. Do not merge another contributor's branch without coordinating.

## API overview

| Method | Endpoint | Use |
| --- | --- | --- |
| GET | `/mentors` | Fetch mentors |
| GET | `/appointments` | Fetch appointments |
| POST | `/appointments` | Create an appointment |
| PATCH | `/appointments/:id` | Update an appointment |
| DELETE | `/appointments/:id` | Delete an appointment |

Each appointment stores a date, mentor ID, session ID, student name, and discussion topic. JSON Server persists changes to the local `db.json` file.

---
