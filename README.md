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

### GitHub Actions secrets

Add these repository secrets under **GitHub → Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`: a Vercel access token
- `VERCEL_ORG_ID`: the Vercel team ID that owns the project
- `TF_TOKEN_app_terraform_io`: a Terraform Cloud API token
- `VERCEL_PROJECT_ID`: the existing project's ID for the initial Terraform import only; omit it when Terraform should create a new project

`GITHUB_TOKEN` is supplied automatically by GitHub Actions. The existing Vercel project does not need to be connected to this GitHub repository. Disable Vercel automatic Git deployments if enabled, so GitHub Actions remains the single deployment mechanism.

### Terraform setup and project lifecycle

Terraform uses the CLI-driven Terraform Cloud workspace `devops-project-2` in organization `kth-devops-project`. Configure these Terraform workspace variables because remote runs need their values:

- `vercel_api_token` (sensitive): the Vercel token
- `vercel_team_id`: the Vercel team ID
- `database_url` (sensitive): the Neon connection string

Do not put database credentials in the repository. The API currently keeps scores in memory and does not yet use this database connection.

The project name defaults to `devops-project`. If you change the Terraform Cloud variable `vercel_project_name`, also change `VERCEL_PROJECT_NAME` in `.github/workflows/app.yml` so deployments resolve the matching project.

For the existing Vercel project, keep `VERCEL_PROJECT_ID` set for the first manual Terraform run. The workflow imports that project and any existing managed production environment variables into Terraform state. Later runs detect those resources in state and skip their imports. Once the import succeeds, `VERCEL_PROJECT_ID` is no longer needed by the deployment job, which resolves the generated project ID from Vercel by name.

To create a new project, leave `VERCEL_PROJECT_ID` unset and run the workflow manually from **GitHub → Actions → project pipeline → Run workflow**. Terraform creates the project and its environment variables. Run this manual Terraform workflow before pushing to `main`, because production deployment expects the project to exist. The Vercel token must have permission to create projects in the selected team.

Terraform applies changes to the project configured in its state. Destroying the Terraform-managed project resource can delete the Vercel project and its deployments, so review Terraform plans carefully before approving or applying changes.

