const csv = require("csv/sync");
const fs = require("fs");

const main = csv.parse(fs.readFileSync("./cardlist-main.csv"), { columns: true });
const planets = csv.parse(fs.readFileSync("./cardlist-planets.csv"), { columns: true });

for (const card of [...main, ...planets]) {
  fs.copyFileSync(`./tmp/${card["Card #"]}.webp`, `./tmp/${card.Name.replace(/ /g, "_")}.webp`);
  fs.copyFileSync(`./tmp/${card["Card #"]}.webp`, `./tmp/${card.Name.replace(/ /g, "_")}-thumb.webp`);
  fs.rmSync(`./tmp/${card["Card #"]}.webp`)
  fs.rmSync(`./tmp/${card["Card #"]}.png`)
}
