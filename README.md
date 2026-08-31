# NoteTube AI — Real AI MVP

This version connects the UI to an OpenAI server-side API and generates structured notes from transcript text.

## Run

Node.js 18+ required.

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set:

```text
OPENAI_API_KEY=...
```

### Transcript integration

The API route deliberately does NOT scrape or download YouTube content. A production app should use a transcript/caption source that you are authorized to use and integrate it at the marked section in `app/api/generate/route.js`.

For a quick test, set `TRANSCRIPT_TEXT` in `.env.local` to a transcript you have permission to process. The app will send that transcript to the LLM and generate notes.

## Deploy

Push the project to GitHub, import it into Vercel, and add `OPENAI_API_KEY` as a server environment variable.

Never put the OpenAI key in client-side JavaScript.

## PDF

The Export PDF button uses the browser's print dialog with an A4-friendly print stylesheet. A production version can use a server-side PDF renderer if automatic file generation is required.
