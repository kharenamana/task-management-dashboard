import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TaskFlow — Full-stack task dashboard",
    short_name: "TaskFlow",
    description:
      "A secure task dashboard and production-minded engineering case study.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf5",
    theme_color: "#6d28d9",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
