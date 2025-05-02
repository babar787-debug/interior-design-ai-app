# AI Interior Designer WebApp

This project allows users to generate AI-based room designs using GPT-4, DALL-E, and Replicate's image captioning.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install

2. Setup environment variables Create a .env.local file based on .env.local.example, and add your API keys:

    OPENAI_API_KEY (from OpenAI)

    REPLICATE_API_TOKEN (from Replicate)

3. Run the development server

    npm run dev

    Access your app Open http://localhost:3000 in your browser.

Features:

    Upload a real room photo for better AI suggestions

    Pick a room style (Modern, Boho, Japandi, etc.)

    Generate, view, and download interior design images

    Save prompt history locally


Tech Stack

    Next.js 14 (App Router)

    TypeScript

    TailwindCSS

    OpenAI GPT-4

    OpenAI DALL-E

    Replicate BLIP model (image captioning)