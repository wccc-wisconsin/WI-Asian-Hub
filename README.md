# WCCC Business App

Vite + React starter for the WCCC business directory app.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Environment variables

Create `.env.local`:

```bash
VITE_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add the two `VITE_...` environment variables in Vercel project settings.
4. Deploy.
