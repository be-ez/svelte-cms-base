# SvelteKit Portfolio Base

A modern, full-featured SvelteKit base project for building portfolio websites. This template includes everything you need to build a performant, content-driven website with a great developer experience.

## Features

- 🚀 Built with [SvelteKit](https://kit.svelte.dev/)
- 🎨 [TailwindCSS](https://tailwindcss.com/) for styling
- 📝 [MDSvex](https://mdsvex.com/) for Markdown/MDX support
- 🖼️ Automated image pipeline with optimization
- 📱 Responsive mobile-first design
- 🗃️ [Directus](https://directus.io/) integration for content management
- 📄 Multiple content types (posts, photos, recipes)
- 🚢 Ready for deployment on Heroku/Dokku

## Getting Started

1. Clone this repository

```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
DIRECTUS_TOKEN=your_directus_token
DIRECTUS_API_URL=your_directus_url
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see your application.

## Project Structure

```
├── src/
│   ├── components/     # Reusable Svelte components
│   ├── lib/           # Shared utilities and functions
│   ├── routes/        # SvelteKit routes and pages
│   └── app.html       # HTML template
├── static/            # Static assets
└── svelte.config.js   # SvelteKit configuration
```

### Key Directories

- `src/components/`: Contains all reusable components organized by feature
- `src/routes/`: Page components and API routes
- `src/lib/`: Shared utilities, including image pipeline and Directus integration
- `static/`: Static assets like images and fonts

## Development

### Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

### Image Pipeline

The project includes an automated image pipeline that:

- Processes images from Directus
- Generates optimized versions
- Caches results for better performance

### Content Management

Content is managed through Directus CMS. The project supports multiple content types:

- Blog posts
- Photo galleries
- Recipes
- Custom pages

## Deployment

The project is configured for deployment on Heroku/Dokku using the static adapter. Required buildpacks are:

- Node.js
- Nginx

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
