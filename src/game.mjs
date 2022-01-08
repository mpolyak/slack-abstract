import {hsl2rgb} from "./color.mjs";

export class GameOfLife {
    static version = 1;

    static create(width, height, seedFn) {
        const size = width * height * 4;

        const frame = new Uint8ClampedArray(size);
        const image = new Uint8ClampedArray(size);

        const [r, g, b] = hsl2rgb(0, 0.8, 0.5);

        for (let y = 0; y < height; y ++) {
            for (let x = 0; x < width; x ++) {
                const p = (y * width + x) * 4;

                frame[p + 0] = r;
                frame[p + 1] = g;
                frame[p + 2] = b;
                frame[p + 3] = seedFn(x, y) ? 255 : 0;
            }
        }

        image.fill(255);

        return new GameOfLife(width, height, 0, frame, image);
    }

    static deserialize(text) {
        const obj = JSON.parse(text, (_, value) => {
            if (Array.isArray(value)) {
                return Uint8ClampedArray.from(value);
            }

            return value;
        });

        if (obj.version !== GameOfLife.version) {
            throw new Error(
                `Version ${GameOfLife.version} cannot deserialize version ${obj.version}`);
        }

        return new GameOfLife(
            obj.width,
            obj.height,
            obj.generation,
            obj.frame,
            obj.image);
    }

    constructor(width, height, generation, frame, image) {
        this.version = GameOfLife.version;

        this.width = width;
        this.height = height;
        
        this.generation = generation;

        this.frame = frame;
        this.image = image;

        this._frame = new Uint8ClampedArray(frame);
    }

    serialize() {
        return JSON.stringify(this, (key, value) => {
            if (key === "_frame") {
                return undefined;
            }

            if (value instanceof Uint8ClampedArray) {
                return Array.from(value);
            }

            return value;
        });
    }

    update() {
        this.generation ++;

        const color = hsl2rgb(this.generation % 360, 0.8, 0.5);

        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                let l = 0;

                for (let v = y - 1; v <= y + 1; v ++) {
                    for (let u = x - 1; u <= x + 1; u ++) {
                        if (v === y && u === x) {
                            continue;
                        }

                        let r = v % this.height;
                        let s = u % this.width;

                        if (r < 0) {
                            r += this.height;
                        }

                        if (s < 0) {
                            s += this.width;
                        }

                        if (this.frame[(r * this.width + s) * 4 + 3]) {
                            l ++;
                        }
                    }
                }

                const p = (y * this.width + x) * 4;

                if (this.frame[p + 3]) {
                    if (l < 2 || l > 3) {
                        this._frame[p + 3] = 0;
                    }
                } else if (l === 3) {
                    let r = 0;
                    let g = 0;
                    let b = 0;
                    let n = 0;

                    for (let v = y - 1; v <= y + 1; v ++) {
                        for (let u = x - 1; u <= x + 1; u ++) {
                            if (v < 0 || v >= this.height || u < 0 || u >= this.width) {
                                continue;
                            }

                            const q = (v * this.width + u) * 4;

                            if (this._frame[q + 3]) {
                                r += Math.pow(this._frame[q + 0], 2);
                                g += Math.pow(this._frame[q + 1], 2);
                                b += Math.pow(this._frame[q + 2], 2);
                                n ++;
                            }
                        }
                    }

                    if (n) {
                        r = ~~Math.sqrt(r / n);
                        g = ~~Math.sqrt(g / n);
                        b = ~~Math.sqrt(b / n);
                    } else {
                        r = color[0];
                        g = color[1];
                        b = color[2];
                    }

                    this._frame[p + 0] = r;
                    this._frame[p + 1] = g;
                    this._frame[p + 2] = b;
                    this._frame[p + 3] = 255;
                }
            }
        }

        this.frame.set(this._frame);

        for (let y = 0; y < this.height; y += 8) {
            for (let x = 0; x < this.width; x += 8) {
                let r = 0;
                let g = 0;
                let b = 0;
                let n = 0;

                for (let v = y; v < y + 8; v ++) {
                    for (let u = x; u < x + 8; u ++) {
                        const p = (v * this.width + u) * 4;

                        r += Math.pow(this.frame[p + 0], 2);
                        g += Math.pow(this.frame[p + 1], 2);
                        b += Math.pow(this.frame[p + 2], 2);
                        n ++;
                    }
                }

                r = ~~Math.sqrt(r / n);
                g = ~~Math.sqrt(g / n);
                b = ~~Math.sqrt(b / n);

                for (let v = y; v < y + 8; v ++) {
                    for (let u = x; u < x + 8; u ++) {
                        const p = (v * this.width + u) * 4;

                        this.image[p + 0] = r;
                        this.image[p + 1] = g;
                        this.image[p + 2] = b;
                    }
                }
            }
        }
    }
}
