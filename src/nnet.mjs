import {Gaussian} from "./random.mjs";

export class CPPN {
    constructor(seed) {
        this.g = new Gaussian(seed)
        this.l = [];
    }

    layer(n, act) {
        this.l.push({n, act});
        this.w = undefined;
        this.n = undefined;
        return this;
    }

    forward(...n) {
        if (this.w == null) {
            this.w = [];
            this.n = [];

            for (let i = 0; i < this.l.length; i ++) {
                const w = [];

                if (i > 0) {
                    for (let j = 0; j < this.l[i].n; j ++) {
                        const l = new Float32Array(this.l[i - 1].n);

                        for (let k = 0; k < l.length; k ++) {
                            l[k] = this.g.sample();
                        }

                        w.push(l);
                    }
                }

                this.w.push(w);
                this.n.push(new Float32Array(this.l[i].n));
            }
        }

        for (let i = 0; i < n.length; i ++) {
            this.n[0][i] = n[i];
        }

        for (let i = 1; i < this.l.length; i ++) {
            for (let j = 0; j < this.l[i].n; j ++) {
                let sum = 0;

                for (let k = 0; k < this.l[i - 1].n; k ++) {
                    sum += this.n[i - 1][k] * this.w[i][j][k];
                }

                this.n[i][j] = this.l[i].act(sum);
            }
        }

        return this.n[this.n.length - 1];
    }
}
