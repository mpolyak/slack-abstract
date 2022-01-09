#!/bin/bash
# Generate example.gif using ffmpeg

cat << EOF | node | ffmpeg -f image2pipe -framerate 5 -i - -filter_complex "[0]crop=128:128:0:0,drawbox=c=black[board];[0]crop=128:128:0:128,drawbox=c=black[image];[board][image]hstack[fg];color=black[bg];[bg][fg]scale2ref[bg][fg];[bg][fg]overlay=format=auto:shortest=1" -y example.gif
const {Buffer} = require("buffer");
const process = require("process");

const {PNG} = require("pngjs");

import("./src/game.mjs").then(({GameOfLife}) => {
    const game = GameOfLife.create(128, 128, (x, y) => !(y % 5));

    const png = new PNG({
        width: game.width,
        height: game.height * 2,
    });

    const frames = [];

    for (let i = 0; i < 440; i ++) {
        game.update();

        if (i >= 90 && !(i % 10)) {
            png.data.set(game.board);
            png.data.set(game.image, game.width * game.height * 4);

            frames.push(PNG.sync.write(png, {colorType: 6}));
        }
    }

    process.stdout.write(Buffer.concat(frames));
});
EOF
