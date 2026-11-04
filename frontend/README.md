# DPERCP Sidebar and Page Navigation

This version keeps all sidebar menu definitions in `src/App.jsx`.
`Sidebar.jsx` receives the navigation items as a prop and only renders them.
The page components are separate files and are connected with React Router.

## Install and run

```bash
npm install
npm run dev
```

## Important

- `src/App.jsx`: defines the sidebar menu list and all routes.
- `src/components/Sidebar.jsx`: renders the menu received through props. It contains no menu data.
- `src/layouts/DashboardLayout.jsx`: shared sidebar + navbar + page content layout.
- `src/pages`: individual route components.
- Replace the simple placeholder page contents with your existing page code if you already implemented those pages.
- The Overview page contains basic sample dashboard content only.
