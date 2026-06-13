import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZapFood",
    short_name: "ZapFood",
    description:
      "ZapFood. Escolha como prefere aproveitar sua refeicao com praticidade e sabor.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF2D20",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
