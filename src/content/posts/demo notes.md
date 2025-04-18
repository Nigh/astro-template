---
title: 'How I build this demo'
date: 2025-04-17
tags: ['astro', 'markdown']
description: 'This is the 2nd post.'
---

# Demo notes

I'll document the process of making this demo below

## Day0

```sh
npm create astro@latest
npm run astro add svelte
npm run astro add tailwind
```

- Replaced some assets
- Edited content of `Welcome.astro` `Layout.astro`

Now the site could work locally.

## Day1

I'm going to make it so that it can be built and deployed automatically on GitHub, but the site isn't necessarily going to be deployed on the root domain, so I need to be able to use a variable that can specify the deployed domain at build time.

Here I used the variable `PUBLIC_BASE_URL`.

In the `.astro` file, you can use `import.meta.env.PUBLIC_BASE_URL` to get the environment variable directly. But not in the `astro.config.mjs` file.

In the `astro.config.mjs` file, we need a `dotenv` package to get the environment variables.

```sh
npm install dotenv -D
```

We install the package and then we can define the path to `base` in the `astro.config.mjs` file using the variable `PUBLIC_BASE_URL` as follows.

Since this site is going to be deployed at https://nigh.github.io/astro-demo/, edit `base` and `site` as below. The `site` could also be a variable, which I will optimize it after.

```js
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  base: process.env.PUBLIC_BASE_URL || '/',
  site: 'https://nigh.github.io',
});
```

Then add a env variable in the workflow. After that, this site should be able to build and deploy automatically on GitHub.

```yaml
env:
  PUBLIC_BASE_URL: '/astro-demo/'
```

## Day2

When I build in different shell environments, I need to use different syntax to configure environment variables, like in powershell:

```sh
$env:PUBLIC_BASE_URL='/astro-demo/'; npm run build
```

To be able to develop and build with unified commands in different shells, install the `cross-env` package here.

```sh
npm install --save-dev cross-env
```

Then, in the `script` of `package.json`, you can define the environment variables using the following:

```json
"dev": "cross-env PUBLIC_BASE_URL='/' astro dev",
```

After that, let's add `prettier` for format.

```sh
npm install -D prettier prettier-plugin-astro
```

then create `.prettierrc`, `.prettierignore`; then add content below in `package.json`

```json
"format": "prettier --write ."
```

I can use `npm run format` now.

## Day3

Use `content collection` to render a series of `markdown` documents into pages.

First, define a content schema in `src/content.config.ts` as below:

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
```

Put my markdowns under `src\content\posts`

Then create `src\pages\markdown\index.astro` as a catalog of markdown content. And the `src\pages\markdown\[slug].astro` for render the files from collection.

After that, let's add styles for markdown render.

Add `src\styles\markdown.css`, then import it in `Layout.astro`.

Some style may not works since the markdown plugin may add some inline styles in markdown render, especially the code block.

Add the setting below to disable it:

```js
  markdown: {
    syntaxHighlight: false, // <-- disables Shiki (which adds inline styles)
  },
```

Because my `markdown.css` is limited to take effect with `class=markdown-body`. So in `[slug].astro`, you need to wrap the content of `markdown` with a `div` with the same `class`. Just like below.

```astro
<Pages>
  <div class="markdown-body">
    <Content />
  </div>
</Pages>
```

## Day4

Let's add more style.

Install `daisyui`

```sh
npm install daisyui@latest
```

Add `src/styles/tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then add a `src/styles/global.css` to include `daisyui` and `tailwind`

```css
@import 'tailwindcss';
@plugin "daisyui";
@plugin "daisyui/theme" {
	...
}
```

import it in `Layout.astro`

```js
import '../styles/global.css';
```

## Day5

Added more content and more style.

## Day6

Let's finish some of the work delayed.

Add env variables `PUBLIC_SITE_URL` in the workflow.

```yml
env:
  PUBLIC_BASE_URL: '/astro-demo/'
  PUBLIC_SITE_URL: 'https://nigh.github.io'
```

The settings in the `astro.config.mjs` should looks like below.

```js
  base: process.env.PUBLIC_BASE_URL || '/',
  site: process.env.PUBLIC_SITE_URL
  ? process.env.PUBLIC_SITE_URL + (process.env.PUBLIC_BASE_URL || '')
  : undefined,
```

The next, add a fetch render to make it able to render the remote markdowns.

First, install a markdown parser.

```sh
npm install marked
```

Next, change `src/index.astro` to below:

```astro
---
import { marked } from 'marked';
import Pages from '../layouts/Pages.astro';

const response = await fetch(
  'https://raw.githubusercontent.com/Nigh/nigh/refs/heads/master/README.md'
);
const markdown = await response.text();
const html = marked(markdown);
---

<Pages>
  <div class="markdown-body">
    <article set:html={html} />
  </div>
</Pages>
```

Now, it fetchs markdown from my GitHub profile, and rendered in the home page.

Taking it a step further, I could make this a component. Let's create `src/components/RemoteMD.astro`

```astro
---
import { marked } from 'marked';
const { url } = Astro.props;
const response = await fetch(url);
const markdown = await response.text();
const html = marked(markdown);
---

<div class="markdown-body">
  <article set:html={html} />
</div>
```

Using this component to render remote markdown would be very easy. The `index.astro` could become:

```astro
---
import RemoteMD from '../components/RemoteMD.astro';
import Pages from '../layouts/Pages.astro';
---

<Pages>
  <RemoteMD url="https://raw.githubusercontent.com/Nigh/nigh/refs/heads/master/README.md" />
</Pages>
```

Works done for this demo, I'll create a Astro template from this demo.
