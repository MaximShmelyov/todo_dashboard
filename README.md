# Todo Dashboard

A modern, full-featured dashboard for managing todos, notes, and shopping lists with family/group support. Built with Next.js, React, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- **Todos, Notes, Shopping Lists**: Organize your life with separate collection types.
- **Family/Group Management**: Create families, invite members, assign roles (Admin, Moderator, User).
- **Collections & Items**: Add, edit, delete collections and items. Mark items as done.
- **Authentication**: Secure login with NextAuth (via Google account).
- **Role-based Access**: Permissions based on family roles.
- **Responsive UI**: Clean, mobile-friendly design with Tailwind CSS.
- **Testing & Linting**: Automated tests (Vitest), ESLint, Prettier, and GitHub Actions CI.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL
- [NextAuth.js](https://authjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for testing
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) for code quality

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL database

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MaximShmelyov/todo_dashboard.git
   cd todo_dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm ci
   ```

3. **Configure environment variables:**
   - Copy .env.example to .env and fill in your database and authentication secrets.

4. **Set up the database:**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

### Testing

Run all tests with coverage:

```bash
npm run test:coverage
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

### Project Structure

- src/app/ — Next.js app routes and pages
- src/components/ — Reusable UI components
- src/db/ — Prisma models and data access logic
- prisma/schema.prisma — Database schema
- .github/workflows/ — CI workflows

### License

[MIT](LICENSE)
