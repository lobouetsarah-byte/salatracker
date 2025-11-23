# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/eb5850f6-b564-48dd-8bc4-c681675a0d22

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/eb5850f6-b564-48dd-8bc4-c681675a0d22) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure Supabase environment variables (REQUIRED)
# See docs/QUICK_START.md for detailed instructions
# Create .env and .env.production files with your Supabase credentials

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## ⚙️ Supabase Configuration (IMPORTANT)

This app uses **Supabase** for backend services. Before running the app, you MUST configure environment variables:

### Quick Setup (3 steps)

1. Get your credentials from [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API
2. Create two files in the project root:
   - `.env` (for development)
   - `.env.production` (for mobile/production builds)
3. Add to both files:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

### Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - 3-step setup (start here!)
- **[Full Setup Guide](./docs/supabase-env-setup.md)** - Detailed instructions
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues

**Note**: If you skip this step, the app will show a configuration error screen instead of working correctly.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb5850f6-b564-48dd-8bc4-c681675a0d22) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
