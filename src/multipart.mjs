import {Buffer} from "buffer";

export class FormData {
    constructor() {
        this.boundary = `------------------------${new Date().getTime().toString(16)}`;

        this.buffer = Buffer.from("", "utf8");
    }

    addString(name, value) {
        this.buffer = Buffer.concat([
            this.buffer,
            Buffer.from(`--${this.boundary}\r\n`, "utf8"),
            Buffer.from(`Content-Disposition: form-data; name="${name}"; \r\n\r\n${value}\r\n`, "utf8"),
        ]);

        return this;
    }

    addFile(name, filename, file) {
        this.buffer = Buffer.concat([
            this.buffer,
            Buffer.from(`--${this.boundary}\r\n`, "utf8"),
            Buffer.from(`Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n`, "utf8"),
            Buffer.from(`Content-Type: application/octet-stream\r\n\r\n`, "utf8"),
            Buffer.from(file, "binary"),
            Buffer.from(`\r\n`, "utf8"),
        ]);

        return this;
    }

    getHeaders() {
        return {
            "Content-Type": `multipart/form-data; boundary=${this.boundary}`,
        };
    }

    getData() {
        return Buffer.concat([
            this.buffer,
            Buffer.from(`--${this.boundary}--\r\n`, "utf8"),
        ]);
    }
}
