import { defineApp } from "iles";

export default defineApp({
  head(ctx) {
    const { frontmatter, site } = ctx;
    return {
      meta: [
        {
          property: "author",
          content: frontmatter?.author || "Lindsay Wardell",
        },
        {
          property: "og:site_name",
          content: "Star Commander",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: frontmatter?.title || site.title,
        },
        {
          property: "og:description",
          content: frontmatter?.snippet || site.description,
        },
        {
          property: "og:image",
          content: frontmatter?.image || "/battleship.jpg",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: frontmatter?.title || site.title,
        },
        {
          property: "twitter:description",
          content: frontmatter?.snippet || site.description,
        },
        {
          property: "twitter:image",
          content: frontmatter?.image || "/battleship.jpg",
        },
      ],
    };
  },
});
