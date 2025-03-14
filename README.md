## What is this

This is a webui for any OpenAI-compatible chat API server. I use it mainly for interacting with my locally hosted LLMs. You can also hook it to any compatible chat server by setting the `NEXT_PUBLIC_CHAT_ENDPOINT` environment variable to point to the chat completion endpoint (for example by creating a `.env` file and put it in there).

## Getting Started

First, install the required modules

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun --bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the webui

If everything works correctly, you should get something like this:

<video width="320" height="240" controls>
  <source src="/examples/demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## FAQs

`How do I setup a local AI chat server?`

Check out [llama.cpp](https://github.com/ggml-org/llama.cpp), that's what I'm using