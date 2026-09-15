# Jetswim Octopus

Jetswim Octopus is now a browser game built with HTML, CSS, JavaScript, and the original image and sound assets. The old `pygame` implementation remains in `src/jetswimOctopus.py` as a reference.

## Run locally

Because the game loads image and audio assets, serve the repository over HTTP instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Use `Space`, `Enter`, click, or tap to swim.

## Deploy to Vercel

This is a static site, so no build command or framework adapter is required:

1. Import this GitHub repository into Vercel.
2. Leave the project root as the repository root.
3. Leave the build command empty and the output directory empty.
4. Deploy.

Vercel will serve `index.html` and deploy new commits automatically. The existing GitHub Actions workflow can continue to run Python checks for the reference implementation.