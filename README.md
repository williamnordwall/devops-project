# Jetswim Octopus

Jetswim Octopus is a browser game built with HTML, CSS, JavaScript, and the original image and sound assets. The old `pygame` implementation remains in `src/jetswimOctopus.py` as a reference.

## Live deployment

Play or review the deployed game at <https://devops-project-76rrq56kc-william-6c66.vercel.app/>. This is public deployment URL and can be accessed by anyone.

## Run locally

You can also run the game locally in a browser. Install Python 3, then run the below command in the repository root:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Use `Space`, `Enter`, click, or tap to swim.

## Deploy to Vercel with GitHub Actions

The workflow in `.github/workflows/app.yml` runs linting, tests, and static checks on pushes and pull requests targeting `main`. A push to `main` deploys the app to the existing Vercel project using `BetaHuhn/deploy-to-vercel-action@v1`. Terraform runs only when the workflow is started manually with **Run workflow**; it does not run on pushes or pull requests.

### Existing Vercel project

If you want to connect this to your own vercel deployment, follow the steps below. The existing Vercel project is configured to use the GitHub Actions workflow for deployment, rather than Vercel's Git integration.

The existing Vercel project does not need to be connected to this GitHub repository. GitHub Actions deploys to it using its Vercel IDs and token. If setting up a new Vercel project, disable Vercel's automatic Git deployments if they are enabled, to avoid duplicate deployments.

Add these repository secrets under **GitHub → Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`: a Vercel access token
- `VERCEL_ORG_ID`: the Vercel team or account ID for the project
- `VERCEL_PROJECT_ID`: the ID of the Vercel project to deploy
- `TF_TOKEN_app_terraform_io`: a Terraform Cloud API token, needed by the Terraform job

`GITHUB_TOKEN` is supplied automatically by GitHub Actions. Terraform also receives the Vercel token and project ID through the `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` secrets.

