import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "robots.txt"],
      manifest: {
        name: "Salatracker - Suivi des Prières",
        short_name: "Salatracker",
        description: "Application de suivi des prières quotidiennes avec notifications intelligentes",
        theme_color: "#1e3a8a",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "https://app.salatracker.com/",
        id: "com.salatracker.app",
        lang: "fr",
        dir: "ltr",
        icons: [
          {
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["lifestyle", "productivity", "utilities"],
        shortcuts: [
          {
            name: "Voir les prières",
            short_name: "Prières",
            url: "/?tab=prayers",
            icons: [{ src: "/favicon.png", sizes: "192x192" }]
          },
          {
            name: "Statistiques",
            short_name: "Stats",
            url: "/?tab=stats",
            icons: [{ src: "/favicon.png", sizes: "192x192" }]
          }
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "prayer-times-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
