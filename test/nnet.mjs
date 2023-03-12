import assert from "assert";

import {CPPN} from "../src/nnet.mjs";
import {test} from "../src/test.mjs";

test("should generate", () => {
    const net = new CPPN(42)
        .layer(3)
        .layer(8, (x) => Math.cos(x))
        .layer(8, (x) => Math.tanh(x))
        .layer(3, (x) => Math.sin(x));

    const v = net.forward(1, 2, 3);

    assert.equal(Math.round(v[0] * 10), 3);
    assert.equal(Math.round(v[1] * 10), -5);
    assert.equal(Math.round(v[2] * 10), 5);
});
