import process from "process";

export function envOrExit(name) {
	if (!(name in process.env)) {
	    console.error(`${name} not set in environment`);

	    process.exit(1);
	}

	return process.env[name];
}
