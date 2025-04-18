
# [Astro Template](https://nigh.github.io/astro-template/)

![image](https://github.com/user-attachments/assets/4865abd6-ad35-48a7-a372-e7b78c6f7497)

It's a twitter-like Astro blog template. Based on [commit](https://github.com/Nigh/astro-demo/commit/977beef307ba171c1f6aa281746cbda4611b9417)

## Usage

Before you use this template, these are the following places you need to modify according to your actual environment.
1. `.github\workflows\deploy.yml`
	- If you don't need to use GitHub's workflow for deployment, then you should just remove it.
	- Otherwise, you should edit the two environment variables under `jobs->build-and-deploy->env` to match your deployment url.
2. `package.json`
	- You need to modify the `build` script like this
		```json
		"build": "cross-env PUBLIC_BASE_URL='/astro-template/' cross-env PUBLIC_SITE_URL='https://nigh.github.io' astro build"
		```
		As with workflow above, configure it with the correct environment variables


Now, things would works perfectly.

```sh
npm install
# start a dev server
npm run dev
```

```sh
# prettier format
npm run format
# build a static site
npm run build
```
