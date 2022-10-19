const fs = require("fs");
const path = require("path");
const express = require("express");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true,
});

async function createServer() {
  const app = express();

  app.use(express.static(path.join(__dirname, "../public")));

  app.use("/", async (req, res) => {
    try {
      const template = fs.readFileSync(
        path.join(__dirname, "index.html"),
        "utf-8"
      );
      const css = fs.readFileSync(path.join(__dirname, "style.css"), "utf-8");

      // import the markdown files
      const welcome = fs.readFileSync(
        path.join(__dirname, "../rules/guide/welcome.md")
      );
      const playArea = fs.readFileSync(
        path.join(__dirname, "../rules/guide/play-area.md")
      );
      const cardTypes = fs.readFileSync(
        path.join(__dirname, "../rules/guide/card-types.md")
      );
      const domains = fs.readFileSync(
        path.join(__dirname, "../rules/guide/domains.md")
      );
      const overview = fs.readFileSync(
        path.join(__dirname, "../rules/play/overview.md")
      );
      const ready = fs.readFileSync(
        path.join(__dirname, "../rules/play/ready.md")
      );
      const command = fs.readFileSync(
        path.join(__dirname, "../rules/play/command.md")
      );
      const combat = fs.readFileSync(
        path.join(__dirname, "../rules/play/combat.md")
      );
      const end = fs.readFileSync(path.join(__dirname, "../rules/play/end.md"));
      const gameOver = fs.readFileSync(path.join(__dirname, "../rules/play/game-over.md"));
      const additionalRules = fs.readFileSync(
        path.join(__dirname, "../rules/etc/additional-rules.md")
      );

      // transform the markdown
      const markdown = md.render(
        [
          welcome,
          cardTypes,
          domains,
          playArea,
          overview,
          ready,
          command,
          combat,
          end,
          gameOver,
          additionalRules,
        ].join("\n")
      );

      const html = template
        .replace("<!--content-->", markdown)
        .replace("/*css*/", css);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.log(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000);
}

createServer();
