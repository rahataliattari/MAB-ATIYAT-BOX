# MAB Atiyat Box — GitHub First Version

A GitHub-ready, responsive first version of an Atiyat Box Management web application inspired by the uploaded **MANAGEMENT ATIYAT BOX (DAWAT-E-ISLAMI)** interface.

## Included
- Responsive sidebar navigation
- Dashboard with KPI cards
- Collection trend and box-status charts
- Box Management with search and filters
- Collection Details
- Reports module
- Placeholder modules matching the reference system structure
- Add Box modal
- Mobile navigation
- Sample data separated in `assets/app.js`

## Run locally
Open `index.html` in a browser.

For the cleanest local development experience, use VS Code + Live Server or any static HTTP server.

## GitHub Pages
1. Create a new GitHub repository.
2. Upload all files and folders.
3. Go to **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/root`.
6. Save. GitHub will publish `index.html`.

## Live Google Sheet integration — next phase
The current version intentionally uses sample data so it works immediately on GitHub Pages.

Recommended production architecture:

`Google Sheet → Google Apps Script Web App/API → assets/app.js → Dashboard`

Keep the Google Apps Script URL in one configuration object and replace the sample `state.data` with fetched JSON.

## Important
This is an independently implemented UI inspired by the uploaded reference. It does not copy or redistribute the original site's source code, private data, credentials, or proprietary backend.
