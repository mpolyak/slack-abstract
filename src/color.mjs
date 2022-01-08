// https://stackoverflow.com/a/54014428
export function hsl2rgb(h, s, l) {
    const a = s * Math.min(l, 1 - l);

    const f = (n, k = (n + h / 30) % 12) =>
        l - a * Math.max(Math.min(k - 3, 9 - k, 1), - 1);

    return [~~(f(0) * 255), ~~(f(8) * 255), ~~(f(4) * 255)];
}
