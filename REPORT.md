# Jetswim Octopus: DevOps Project Report

## Project and architecture

Jetswim Octopus is a browser game deployed as a static site on Vercel. The game was originally made with Pygame, but we changed the implementation to a browser-based game written in JavaScript to be able to apply DevOps. The repository contains the source code, tests, GitHub Actions workflow, and Terraform configuration for managing the Vercel project and selected environment variables. The source is hosted on GitHub. Its root `index.html` serves the browser interface and loads JavaScript, CSS, image, and audio assets from `app/`. The older Pygame implementation in `src/jetswimOctopus.py` is retained as reference code and is not part of the deployed runtime.

Vercel hosts the public deployment and hosts a Node serverless endpoint at `api/high-score.js`.

The main components and their responsibilities are:

- **GitHub repository:** source control, reviewable configuration, test code, and workflow definitions.
- **GitHub Actions:** continuous integration on pushes and pull requests targeting `main`, production deployment on pushes to `main` and a separate manually triggered Terraform job.
- **Vercel:** production hosting for the browser game and serverless API.
- **Terraform and Terraform Cloud:** declarative management of the Vercel project and selected production environment variables, with remote state stored in Terraform Cloud.
- **Node.js and ESLint:** unit-test execution and static code-quality checks for the game logic.

## Build, testing, and delivery process

The workflow is defined in `.github/workflows/app.yml`. On a push or pull request targeting `main`, two jobs run. `code-quality-check` installs the locked dependencies with `npm ci`, runs ESLint, and executes the Node test suite. The tests exercise deterministic pipe creation and collision-boundary behavior in `app/gameLogic.js`. `web-quality-check` checks JavaScript syntax and verifies that the expected HTML, stylesheet, images, and audio assets are present.

Dependabot is configured in `.github/dependabot.yml` to check npm dependencies in `/app` and GitHub Actions versions in the repository weekly. It opens pull requests for available updates, allowing dependency changes to be reviewed and then checked by the normal CI workflow.

Production deployment is the continuous-delivery path. For pushes to `main`, `deploy-to-vercel` waits for both validation jobs to succeed, authenticates with the Vercel token, and deploys to the configured Vercel project. Pull requests run validation but do not deploy. This ordering reduces the chance of deploying a change that has failed the project’s available checks. Reviewers can access the live game at <https://devops-project-mm52dyhab-william-6c66.vercel.app/> without having access to the Vercel project.

Terraform is intentionally not part of ordinary push-triggered deployment. The workflow’s `terraform-check` job runs only for `workflow_dispatch`, the manual GitHub Actions trigger. This is to avoid running terraform every a push is made to the main branch. It initializes Terraform in `infra/`, checks formatting and configuration validity, plans changes, and applies them. The configuration declares a `vercel_project` resource and references its ID for the project's environment variables. In a fresh workspace, Terraform can create the project from the same resource declaration. The remote backend selects Terraform Cloud organization `kth-devops-project` and workspace `devops-project-2`.

The split reflects different risk profiles: application deployment is frequent and gated by automated checks, while infrastructure changes are less frequent and require an explicit human action. GitHub Actions receives deployment credentials through repository secrets. The CLI-driven Terraform Cloud workspace supplies remote-run variables, including the Vercel token and team ID. Values are not committed to source.

### Secrets and variables

The pipeline needs a few credentials and identifiers so it can reach the right services:

- `VERCEL_TOKEN` is a password-like access token that lets GitHub Actions and Terraform make authorized changes in Vercel. It is stored as a GitHub secret.
- `VERCEL_ORG_ID` identifies the Vercel team or account that owns the project. It tells the tools which account to use.
- `TF_TOKEN_app_terraform_io` lets GitHub Actions authenticate to Terraform Cloud, where the infrastructure state is stored and Terraform plans run.
- `GITHUB_TOKEN` is provided automatically by GitHub Actions. The deployment action uses it to report deployment status back to GitHub.
- In the Terraform Cloud workspace, `devops-project-2`, `vercel_api_token` and `vercel_team_id` provide the same Vercel access and team information to Terraform's remote runs. The workflow maps the GitHub secrets to Terraform input variables for its own CLI commands. The workspace values are needed because the plan and apply execute remotely.
- `vercel_project_name` defaults to `devops-project` and tells Terraform which project to manage. `game_score_api_url` defaults to that project's `/api/high-score` endpoint and identifies the score API route. The deployment workflow looks up the project ID using its name, so no project-ID GitHub secret is required.

## Design decisions

We chose to use GitHub as both the development platform and automation host because we are most familiar with it, and it keeps code, review, and pipeline execution in one place. GitHub Actions provides event-based CI/CD without requiring a separately managed runner. Vercel was chosen as the application host, and Terraform manages its project. The repository is not connected to Vercel's Git integration for this workflow. Instead, we use GitHub Actions as the deployment mechanism, as required by the assignment instructions.

Terraform manages the existing Vercel project and selected production environment variables through the remote state in Terraform Cloud. Terraform uses the saved resource IDs in state to manage the project on future runs rather than trying to create it again. Remote state keeps resource tracking independent of a developer's machine.

## AI usage

As described above, the game was originally implemented using Pygame, but we changed the implementation to a browser-based game. This was done mainly with GitHub Copilot. We also used AI tools to brainstorm ideas for what we could do with the project. Copilot was also used for troubleshooting and discussing design decisions and implementations.
