/** @type {import('postcss').Config} */
export default {
  plugins: {
    // Tailwind CSS: generates utility classes from your markup files.
    // Must be listed before autoprefixer so Tailwind's output is processed first.
    tailwindcss: {},
    // Autoprefixer: adds vendor prefixes (e.g. -webkit-) for broad browser support.
    autoprefixer: {},
  },
};
