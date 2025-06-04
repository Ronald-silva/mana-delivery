# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/575f82f9-d5ac-4b78-8d0b-7317b0f9002b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/575f82f9-d5ac-4b78-8d0b-7317b0f9002b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Como implantar no Vercel

Este projeto está configurado para ser implantado no Vercel de forma automática. Para uma implantação bem-sucedida:

1. Conecte seu repositório GitHub ao Vercel
2. O arquivo `vercel.json` já está configurado corretamente
3. O processo de build gerará os arquivos estáticos na pasta `dist`
4. O script `vercel-build` é usado durante a implantação

Se encontrar problemas de implantação:
- Certifique-se de que o Vercel esteja configurado para usar a pasta `dist` como diretório de saída
- Verifique se há erros no console durante o processo de build
- Certifique-se de que todas as dependências estão listadas no `package.json`

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

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

Simply open [Lovable](https://lovable.dev/projects/575f82f9-d5ac-4b78-8d0b-7317b0f9002b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
