import process from "process";

export function test(name, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`${name}:`, err);

        process.exitCode = 1;
    }
}
