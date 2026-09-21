# Jetswim Octopus

Jetswim Octopus is now a browser game built with HTML, CSS, JavaScript, and the original image and sound assets. The old `pygame` implementation remains in `src/jetswimOctopus.py` as a reference.

## Run locally

Because the game loads image and audio assets, serve the repository over HTTP instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/app/index.html>.

Use `Space`, `Enter`, click, or tap to swim.

## Deploy to Vercel with GitHub Actions

The workflow in `.github/workflows/app.yml` checks the browser game and deploys production after a push to `main` using `BetaHuhn/deploy-to-vercel-action@v1`.

### Vercel setup

1. Create a Vercel project connected to this repository, with the repository root as the project root.
2. Select **Other** as the framework, leave the build command empty, and leave the output directory empty.
3. Create a Vercel access token at **Vercel Dashboard → Settings → Tokens**.
4. Link the project locally with `npx vercel link`, then read `orgId` and `projectId` from `.vercel/project.json`.
5. Add these repository secrets under **GitHub → Settings → Secrets and variables → Actions**:

	- `VERCEL_TOKEN`: the Vercel access token
	- `VERCEL_ORG_ID`: the `orgId` from `.vercel/project.json`
	- `VERCEL_PROJECT_ID`: the `projectId` from `.vercel/project.json`

`GITHUB_TOKEN` is supplied automatically by GitHub Actions. Pushes to `main` deploy to production after the web checks pass. Pull requests run validation but do not deploy.

If the Vercel GitHub integration is also enabled for this project, disable its automatic deployments to avoid deploying each commit twice; the GitHub Actions workflow is the deployment mechanism here.