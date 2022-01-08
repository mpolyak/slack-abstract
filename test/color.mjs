import assert from "assert";

import {hsl2rgb} from "../src/color.mjs";
import {test} from "../src/test.mjs";

test("should be black", () => {
    assert.deepEqual(hsl2rgb(0, 0, 0), [0, 0, 0]);
});

test("should be white", () => {
    assert.deepEqual(hsl2rgb(0, 0, 1), [255, 255, 255]);
});

test("should be red", () => {
    assert.deepEqual(hsl2rgb(0, 1, 0.5), [255, 0, 0]);
});

test("should be green", () => {
    assert.deepEqual(hsl2rgb(120, 1, 0.5), [0, 255, 0]);
});

test("should be blue", () => {
    assert.deepEqual(hsl2rgb(240, 1, 0.5), [0, 0, 255]);
});
