export class Gaussian {
    static m = 2**35 - 31;
    static a = 185852;

    constructor(seed) {
        // https://stackoverflow.com/a/72732727
        this.s = seed % Gaussian.m;
    }

    sample(mean=0, stdev=1) {
        const u = (this.s = this.s * Gaussian.a % Gaussian.m) / Gaussian.m;
        const v = (this.s = this.s * Gaussian.a % Gaussian.m) / Gaussian.m;
        // https://stackoverflow.com/a/36481059
        return Math.sqrt(-2.0 * Math.log(1 - u)) * Math.cos(2.0 * Math.PI * v) * stdev + mean
    }
}
