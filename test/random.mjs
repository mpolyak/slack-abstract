import assert from "assert";

import {Gaussian} from "../src/random.mjs";
import {test} from "../src/test.mjs";

test("should be normal", () => {
    const g = new Gaussian(42);

    const values = new Float32Array(100_000);

    let mean = 0;

    for (let i = 0; i < values.length; i ++) {
        values[i] = g.sample();

        mean += values[i];
    }

    mean /= values.length;

    assert.equal(Math.round(mean * 10) / 10, 0);

    let stdev = 0;

    for (let i = 0; i < values.length; i ++) {
        stdev += Math.pow(values[i] - mean, 2);
    }

    stdev = Math.sqrt(stdev / values.length);

    assert.equal(Math.round(stdev * 10) / 10, 1);
});
