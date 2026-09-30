# Jetswim Octopus: DevOps Project Report

## Project and architecture

Jetswim Octopus is a browser game deployed as a static site on Vercel. The game itself is a lightweight demonstration workload; the project is primarily intended to demonstrate a repository-based delivery process, automated checks, and infrastructure configuration. The source is hosted on GitHub. Its root `index.html` serves the browser interface and loads JavaScript, CSS, image, and audio assets from `app/`. The older Pygame implementation in `src/jetswimOctopus.py` is retained as reference code and is not part of the deployed runtime.

Vercel provides the public runtime and hosts a Node serverless endpoint at `api/high-score.js`. The browser calls this same-origin endpoint to read or submit a best score. The endpoint currently stores the value in process memory. This is sufficient to demonstrate an API boundary and request validation, but it is not durable: serverless instances can be recreated or differ between requests. The project does not configure or require a database, so scores are not persisted between independent serverless instances.

The main components and their responsibilities are:

- **GitHub repository:** source control, reviewable configuration, test code, and workflow definitions.
- **GitHub Actions:** continuous integration on pushes and pull requests targeting `main`; production delivery on pushes to `main`; and a separate manually triggered Terraform job.
- **Vercel:** production hosting for the browser game and serverless API.
- **Terraform and Terraform Cloud:** declarative management of the Vercel project and selected production environment variables, with remote state in the `devops-project-2` workspace.
- **Node.js and ESLint:** unit-test execution and static code-quality checks for the game logic.

## Build, testing, and delivery process

The workflow is defined in `.github/workflows/app.yml`. On a push or pull request targeting `main`, two validation jobs run. `code-quality-check` installs the locked dependencies with `npm ci`, runs ESLint, and executes the Node test suite. The tests exercise deterministic pipe creation and collision-boundary behavior in `app/gameLogic.js`. `web-quality-check` checks JavaScript syntax and verifies that the expected HTML, stylesheet, images, and audio assets are present.

Production deployment is the continuous-delivery path. For pushes to `main`, `deploy-to-vercel` waits for both validation jobs to succeed, authenticates with the Vercel token, and deploys to the configured Vercel project. Pull requests run validation but do not deploy. This ordering reduces the chance of deploying a change that has failed the project’s available checks. Reviewers can inspect the live game at <https://devops-project-76rrq56kc-william-6c66.vercel.app/> without receiving dashboard access.

Terraform is intentionally not part of ordinary push-triggered deployment. The workflow’s `terraform-check` job runs only for `workflow_dispatch`, the manual GitHub Actions trigger. It initializes Terraform in `infra/`, checks formatting and configuration validity, plans changes, and applies them. The configuration declares a `vercel_project` resource and references its generated ID for environment variables. On the current installation, the workflow imports the already-existing project by ID before applying; it also imports pre-existing managed environment variables when they are not already tracked in state. For a new installation with no project ID secret, Terraform creates the project. The remote backend selects the Terraform Cloud organization `kth-devops-project` and workspace `devops-project-2`.

The split reflects different risk profiles: application deployment is frequent and gated by automated checks, while infrastructure changes are less frequent and require an explicit human action. GitHub Actions receives deployment credentials through repository secrets. The CLI-driven Terraform Cloud workspace supplies remote-run variables, including the Vercel token and team ID; values are not committed to source.

## Design decisions and requirement coverage

GitHub was selected as both the development platform and automation host because it keeps code, review, and pipeline execution in one place. GitHub Actions provides event-based CI/CD without requiring a separately managed runner. Vercel was retained as the application host, and Terraform manages its project. The repository does not need to be connected to Vercel's Git integration for this workflow; using Actions as the deployment mechanism avoids two independent systems deploying the same commits.

Terraform creates the Vercel project when it is absent and manages selected production environment variables. For this already-deployed project, the GitHub workflow imports the project and existing environment variables into Terraform state first; Terraform state, not a name lookup, is how Terraform knows it already manages those objects. The deployment workflow looks up the project ID by its configured name because the ID may be generated by Terraform. Terraform uses a remote Terraform Cloud workspace so state is not tied to a developer's machine, matching the requirement that Terraform runs through GitHub Actions. Terraform does not create a Neon database.

| Requirement | Current implementation and status |
| --- | --- |
| Automated build and testing | GitHub Actions installs dependencies, runs ESLint and Node tests, checks JavaScript syntax, and verifies required static assets. The project has no separate compilation/build step because the browser app is served as static files. |
| Automated deployment or delivery | A push to `main` deploys to Vercel after both validation jobs pass. Pull requests do not deploy. |
| Infrastructure as Code | Terraform creates/manages the Vercel project and selected environment variables, using remote state in Terraform Cloud workspace `devops-project-2`. Existing resources are imported once. The Terraform job is manually triggered. |
| Modern development platform | GitHub provides the repository, pull-request workflow, Actions, and Actions secrets. |
| Quality or security automation | ESLint provides automated static quality checks, alongside unit tests and syntax/asset checks. A dedicated security scanner is not currently configured. |
| Documented AI-assisted tools | GitHub Copilot was used during development to assist with implementation, troubleshooting, and documentation. Its output was reviewed and checked against repository behavior; tests and pipeline runs remain the verification mechanisms. |
| Runnable project and documentation | The browser game can be served locally with Python's HTTP server. The repository includes the application, API handler, tests, Terraform configuration, GitHub Actions workflow, and README. Local static serving does not emulate Vercel's serverless runtime. |

## Limitations, security, and trade-offs

The largest functional limitation is score durability. The high-score function uses process memory, and the local Python server only serves static files; it does not run the serverless function. A database-backed implementation would need schema creation, connection handling, error behavior, and tests against the persistence layer before the project could claim durable shared scores.

Terraform's scope is intentionally small, but it has operational prerequisites: the Terraform Cloud workspace and GitHub secrets must be configured correctly, and an existing project's ID must be supplied for its initial import. A new project can instead be created by Terraform when no existing ID is supplied. The current configuration has no database credential input. Remove any obsolete `database_url` variable from Terraform Cloud workspace settings because the root module no longer declares it.

The workflow provides quality gates but not comprehensive assurance. It does not currently run a dedicated dependency vulnerability audit, secret scanner, or static security analyzer, and the tests focus on isolated game logic rather than browser-level or deployed API behavior. The manual Terraform apply is deliberate, but it means infrastructure drift is not automatically reconciled and changes can remain unapplied until a person dispatches the workflow. These trade-offs keep the system understandable for a small project while identifying clear next improvements: add dependency/secret scanning, add an integration check for the deployed API, and use durable storage if persistent shared scores become a requirement.

## AI-assisted development

GitHub Copilot was used as an AI-assisted development tool for code changes, workflow and Terraform troubleshooting, and documentation. AI suggestions were treated as proposals rather than authoritative output: the repository configuration and runtime behavior were inspected, and applicable changes were checked with linting, tests, Terraform validation, or GitHub Actions. AI assistance does not replace review of infrastructure changes or handling secrets securely. This report documents that use to make the development process transparent.