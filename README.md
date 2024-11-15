# Local Docker for Development

## Docker compose

Navigate the root of the frontend project and run

```bash
docker compose up --build -d
```

Go to localhost:5173

When finished, run

```bash
docker compose down
```

# Or install locally

## create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# Set Environment variables for development

Create file '.env' with content:

```
VITE_BACKEND_URL=http://localhost:5015
VITE_API_VERSION_V1 = v1
```

# Set Environment variables for production

Create file '.env' with content:

```
VITE_BACKEND_URL=http://api-service:8080
VITE_API_VERSION_V1=v1

```
