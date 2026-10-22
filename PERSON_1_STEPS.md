# Person 1 (you): Part 1 steps

All Part 1 code is already in this `brewscope` folder. You just need to put it on GitHub and Vercel.

## 1. Check it runs
In VS Code: File → Open Folder → `Downloads\Claude Code\brewscope` → Terminal → New Terminal
```bash
npm install
npm run dev
```
Open http://localhost:5173 and check: the hero shows, the country cards open a country page, the Navbar links work, the 🌙/☀️ toggle switches theme, and the menu works at phone width (F12 → Ctrl+Shift+M). Then press Ctrl+C.

## 2. Create the new GitHub repo
github.com/new → name `BrewScope` → Public → **don't tick any boxes** → Create repository.

## 3. Start main with only the README (so Part 1 itself goes through a branch + PR)
Replace YOUR-USERNAME:
```bash
git init
git branch -M main
git add README.md .gitignore
git commit -m "chore: initial commit"
git remote add origin https://github.com/YOUR-USERNAME/BrewScope.git
git push -u origin main
```

## 4. Add teammates
Repo → Settings → Collaborators → Add people → add Persons 2, 3 and 4. They must accept the email invite.

## 5. Protect main
Settings → Rules → Rulesets → New branch ruleset:
- Name: `protect-main`, Enforcement: **Active**
- Bypass list: leave **empty** (so even you must use PRs)
- Target branches: Add target → **Include default branch**
- Rules: Restrict deletions ✅, Block force pushes ✅, **Require a pull request before merging** ✅ with **Required approvals = 1**
- Create

## 6. Part 1 on its own branch
```bash
git checkout -b part-1
git add .
git commit -m "feat: Part 1 - project setup, routing, layout and design system"
git push -u origin part-1
```
On GitHub: yellow **Compare & pull request** banner → check **main ← part-1** → title `feat: Part 1 - project setup, routing, layout and design system` → Create pull request → request a teammate as reviewer.
A teammate approves (Files changed → Submit review → Approve) → you click **Merge pull request**.
Then locally:
```bash
git checkout main
git pull origin main
```

## 7. Deploy on Vercel
vercel.com → Add New → Project → import `BrewScope` → Framework preset **Vite** (auto) → Deploy.
Put the live link in README.md later.

## 8. Hand over to Person 2
Send them the Part 2 prompt. They must:
```bash
git clone https://github.com/YOUR-USERNAME/BrewScope.git
cd BrewScope
git checkout -b part-2
npm install
```
Then open Claude Code **locally** on the `BrewScope` folder and paste the prompt.
