import * as fs from "fs";
import * as https from "https";
import process from "process";
import zlib from "zlib";

import {PNG} from "pngjs";

import {envOrExit} from "./env.mjs";
import {GameOfLife} from "./game.mjs";
import {FormData} from "./multipart.mjs";

const SAVE_GAME = envOrExit("SAVE_GAME");
const SLACK_TOKEN = envOrExit("SLACK_TOKEN");

function create() {
    return GameOfLife.create(512, 512, (x, y) => !(x % 4 && y % 7));
}

function load() {
    if (!fs.existsSync(SAVE_GAME)) {
        return null;
    }

    console.log("Loading save game:", SAVE_GAME);

    try {
        const save = zlib.brotliDecompressSync(fs.readFileSync(SAVE_GAME));

        return GameOfLife.deserialize(save);

    } catch (err) {
        console.error("Bad save game:", err);
    }

    return null;
}

function save(game) {
    console.log("Saving game:", SAVE_GAME);

    const save = zlib.brotliCompressSync(game.serialize());

    fs.writeFileSync(SAVE_GAME, save);
}

function main() {
    const game = load() || create();

    console.log("Game:", game.generation);

    game.update();

    const png = new PNG({
        width: game.width,
        height: game.height,
    });

    png.data.set(game.dream);

    const formData = new FormData()
        .addString("token", SLACK_TOKEN)
        .addFile("image", game.generation, PNG.sync.write(png, {colorType: 6}));

    const options = {
        host: "slack.com",
        port: 443,
        path: "/api/users.setPhoto",
        method: "POST",
        headers: {
            ...formData.getHeaders(),
        }
    };

    const req = https.request(options, res => {
        res.setEncoding("utf8");

        let data = "";

        res.on("data", chunk => {
            data += chunk;
        });

        res.on("end", () => {
            if (res.statusCode == 200) {
                console.log("200:", data);

                try {
                    const result = JSON.parse(data);

                    if (result.ok) {
                        save(game);
                    } else {
                        process.exitCode = 1;
                    }
                } catch (error) {
                    console.error(error);

                    process.exitCode = 1;
                }
            } else {
                console.error(`${res.statusCode}:`, data);

                process.exitCode = 1;
            }
        });
    });

    req.on("error", error => {
        console.error(error);

        process.exitCode = 1;
    });

    req.write(formData.getData());

    req.end();
}

main();
