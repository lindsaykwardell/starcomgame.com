#!/bin/bash

rm -rf tmp
mkdir tmp

gsc -dNOPAUSE -sDEVICE=png16m -r256 -sOutputFile=tmp/%01d.png cards.pdf -c quit;

magick mogrify -format webp tmp/*.png

# for i in tmp/*.png; do sips -s format webp -s formatOptions 70 "${i}" --out "${i%png}webp"; done
node rename-cards.js

magick mogrify -resize 50% tmp/*-thumb.webp

rm -rf ./public/cards
mv ./tmp ./public/cards
cp cardlist-main.csv ./public/cards/cardlist-main.csv
cp cardlist-planets.csv ./public/cards/cardlist-planets.csv