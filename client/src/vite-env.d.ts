/// <reference types="vite/client" />

// Extends Vite's ImportMetaEnv with the specific VITE_* variables used in this project.
// Add a new entry here whenever you add a VITE_* variable to client/.env.
// This gives TypeScript full type safety on import.meta.env throughout the app.
interface ImportMetaEnv {
  /** Base URL of the Express API. Example: http://localhost:5000 */
  readonly VITE_API_URL: string;
}

// Ensures import.meta.env is typed correctly everywhere.
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
