# Jetswim Octopus

Jetswim Octopus is a browser game built with HTML, CSS, JavaScript, and the original image and sound assets. The old `pygame` implementation remains in `src/jetswimOctopus.py` as a reference.

## Live deployment

Play or review the deployed game at <https://devops-project-mm52dyhab-william-6c66.vercel.app/>. This is public deployment URL and can be accessed by anyone.

## Run locally

You can also run the game locally in a browser. Install Python 3, then run the below command in the repository root:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

Use `Space`, `Enter`, click, or tap to swim.

## Deploy to Vercel with GitHub Actions

The workflow in `.github/workflows/app.yml` runs linting, tests, and static checks on pushes and pull requests targeting `main`. A push to `main` deploys the app to the existing Vercel project using `BetaHuhn/deploy-to-vercel-action@v1`. Terraform runs only when the workflow is started manually with **Run workflow**; it does not run on pushes or pull requests.

Terraform applies changes to the project configured in its state. Destroying the Terraform-managed project resource can delete the Vercel project and its deployments, so review Terraform plans carefully before approving or applying changes.

