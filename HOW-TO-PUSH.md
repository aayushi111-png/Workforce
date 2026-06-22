# How to push this repo to GitHub

Two minutes. Pick one of the two routes below.

---

## Route A · Command line (fastest if you have git set up)

From inside the unzipped `KATBOTZ-WOP` folder:

```bash
cd KATBOTZ-WOP

git init
git add .
git commit -m "WOP architecture and proposal v1"

git branch -M main
```

Now create an empty repo on GitHub (no README, no .gitignore, so it stays empty), copy its URL, then:

```bash
git remote add origin https://github.com/<your-username>/katbotz-wop.git
git push -u origin main
```

Done. Refresh the GitHub page and all twelve documents are there, with the diagrams rendering.

---

## Route B · GitHub website, no terminal

1. Go to **github.com/new** on your work account.
2. Name it `katbotz-wop`, set it **Private**, do not add a README or .gitignore, click **Create repository**.
3. On the empty repo page, click **uploading an existing file**.
4. Drag in every file from the unzipped `KATBOTZ-WOP` folder (all the `.md` files plus `.gitignore`).
5. Write a commit message, for example `WOP architecture and proposal v1`, and click **Commit changes**.

Done.

---

## A note on the .gitignore

It already blocks the things that should never reach GitHub: `.env` files, any Google service account JSON, keys, and the `node_modules` and Python folders you will create once the actual build starts. Keep secrets out of the repo from day one.

---

## After it is up

- Set the repo **Private** if it is not. This is internal architecture.
- Open `00-proposal-and-approval.md` first. That is the front door.
- The Mermaid diagrams render automatically on GitHub. If one does not, it is almost always a stray character in the diagram block, fixable in the web editor.
