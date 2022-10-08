const csv = require("csv/sync");
const fs = require("fs");

const main = csv.parse(fs.readFileSync("./cardlist-main.csv"), {
  columns: true,
});
const planets = csv.parse(fs.readFileSync("./cardlist-planets.csv"), {
  columns: true,
});

for (const card of [...main, ...planets]) {
  fs.copyFileSync(
    `./tmp/${card["Card #"]}.webp`,
    `./tmp/${card.Name.replace(/ /g, "_")}.webp`
  );
  fs.copyFileSync(
    `./tmp/${card["Card #"]}.webp`,
    `./tmp/${card.Name.replace(/ /g, "_")}-thumb.webp`
  );
  let subfolder;
  if (card["Card Types"].includes("System")) {
    subfolder = "planets";
  } else if (
    (card["Card Types"].includes("Ship") ||
      card["Card Types"].includes("Fighter") ||
      card["Card Types"].includes("Station")) &&
    card["Domain"] === "Neutral"
  ) {
    subfolder = "ships";
  } else {
    switch (card["Domain"]) {
      case "Industry":
        subfolder = "industry";
        break;
      case "Statecraft":
        subfolder = "statecraft";
        break;
      case "Science":
        subfolder = "science";
        break;
    }
  }
  fs.copyFileSync(
    `./tmp/${card["Card #"]}.png`,
    `./tgc/${subfolder}/${card.Name}[face,${card.Count}].png`
  );
  fs.copyFileSync(
    `./tmp/${card["Card #"]}.png`,
    `./rules/.vuepress/public/${card.Name.replace(/ /g, "_")}.png`
  );
  fs.rmSync(`./tmp/${card["Card #"]}.webp`);
  fs.rmSync(`./tmp/${card["Card #"]}.png`);
}
