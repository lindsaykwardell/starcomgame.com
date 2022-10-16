import { defineUserConfig, defaultTheme } from "vuepress";
// const { path } = require("@vuepress/utils");
import { searchPlugin } from "@vuepress/plugin-search";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { path } from '@vuepress/utils'

export default defineUserConfig({
  lang: "en-US",
  title: "Star Commander Rulebook",
  description: "Official Rulebook for Star Commander",
  head: [
    ["link", { rel: "icon", href: "/images/favicon.png" }],
    ["meta", { name: "og:type", content: "website" }],
    // ["meta", { name: "og:url", content: "https://rules.starcomgame.com" }],
    // ["meta", { name: "og:title", content: "elm-vue-bridge" }],
    // ["meta", { name: "og:description", content: "Render Elm modules in a Vue app" }],
    [
      "meta",
      {
        name: "og:image",
        content: "https://rules.starcomgame.com/images/favicon.png",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    // ["meta", { name: "twitter:url", content: "https://rules.starcomgame.com" }],
    // ["meta", { name: "twitter:title", content: "elm-vue-bridge" }],
    // ["meta", { name: "twitter:description", content: "Render Elm modules in a Vue app" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://rules.starcomgame.com/images/favicon.png",
      },
    ],
  ],

  theme: defaultTheme({
    logo: "/images/favicon.png",
    contributors: false,
    sidebar: {
      "/": [
        {
          text: "Getting Started",
          children: [
            "/guide/welcome.md",
            "/guide/play-area.md",
            "/guide/card-types.md",
            "/guide/domains.md",
          ],
        },
        {
          text: "Playing the Game",
          children: [
            "/play/overview.md",
            "/play/ready.md",
            "/play/command.md",
            "/play/combat.md",
            "/play/end.md",
          ],
        },
        "/etc/additional-rules.md",
        "/etc/faq.md",
      ],
    },
    navbar: [
      {
        text: "Rulebook",
        link: "/guide/welcome.html",
      },
      {
        text: "Download PDF",
        link: "https://rules.starcomgame.com/star_commander_rulebook.pdf",
      },
      {
        text: "Official Site",
        link: "https://starcomgame.com",
      },
    ],
  }),

  plugins: [
    searchPlugin(),
    registerComponentsPlugin({
      components: {
        Card: path.resolve(__dirname, "./components/Card.vue"),
      },
    }),
  ],

  // plugins: [
  //   ["@vuepress/plugin-search"],
  //   [
  //     "@vuepress/register-components",
  // {
  //   components: {
  //     Card: path.resolve(__dirname, "./components/Card.vue"),
  //   },
  // },
  //   ],
  // ],
});
