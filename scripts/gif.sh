#!/bin/bash
# Generate example.gif using ffmpeg

cat << EOF | node | ffmpeg -f image2pipe -framerate 5 -i - -y example.gif
const {Buffer} = require("buffer");
const process = require("process");

const {PNG} = require("pngjs");

import("./src/game.mjs").then(({GameOfLife}) => {
    const game = GameOfLife.create(128, 128, (x, y) => !(y % 5));

    const png = new PNG({
        width: game.width,
        height: game.height,
    });

    const frames = [];

    for (let i = 0; i < 440; i ++) {
        game.update();

        if (i >= 90 && !(i % 10)) {
            png.data.set(game.image);

            frames.push(PNG.sync.write(png, {colorType: 6}));
        }
    }

    process.stdout.write(Buffer.concat(frames));
});
EOF
