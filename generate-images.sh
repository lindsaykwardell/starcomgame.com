#!/bin/bash

rm -rf tmp
mkdir tmp
rm -rf tgc
mkdir tgc
mkdir tgc/ships
mkdir tgc/planets
mkdir tgc/industry
mkdir tgc/statecraft
mkdir tgc/science
mkdir tgc/back
mkdir tgc/rules

gsc -dNOPAUSE -sDEVICE=png16m -r256 -sOutputFile=tmp/%01d.png cards.pdf -c quit;

magick mogrify -format webp tmp/*.png

node rename-cards.js

magick mogrify -resize 50% tmp/*-thumb.webp

sips --resampleHeightWidth 1125 825 tgc/industry/*.png
sips --resampleHeightWidth 1125 825 tgc/statecraft/*.png
sips --resampleHeightWidth 1125 825 tgc/science/*.png
sips --resampleHeightWidth 1125 825 tgc/ships/*.png
sips -r 270 tgc/planets/*.png
sips --resampleHeightWidth 1125 825 tgc/planets/*.png

# cp public/back.jpg tgc/back.jpg
cp public/industry.png tgc/back/industry.png 
cp public/planet.png tgc/back/planet.png
cp public/science.png tgc/back/science.png
cp public/ship.png tgc/back/ship.png
cp public/statecraft.png tgc/back/statecraft.png
cp public/frontcover.png tgc/rules/0.png
cp public/backcover.png tgc/rules/z.png
# cp public/blankpage.png tgc/rules/00.png
cp public/blankpage.png tgc/rules/y.png

sips --resampleHeightWidth 1125 825 tgc/back/*.png

rm -rf ./public/cards
mv ./tmp ./public/cards
cp cardlist-main.csv ./public/cards/cardlist-main.csv
cp cardlist-planets.csv ./public/cards/cardlist-planets.csv

npm run rules:pdf

gsc -dNOPAUSE -sDEVICE=png16m -r256 -sOutputFile=tgc/rules/page%02d.png rules/.vuepress/public/star_commander_rulebook.pdf -c quit;

sips --resampleHeightWidth 2475 1575 tgc/rules/*.png

magick convert tgc/rules/*png rules/.vuepress/public/star_commander_rulebook.pdf