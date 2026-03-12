import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const serverBuildDir = join(process.cwd(), "build", "server");

const findServerEntry = () => {
    const directEntry = join(serverBuildDir, "index.js");
    if (existsSync(directEntry)) {
        return directEntry;
    }

    if (!existsSync(serverBuildDir)) {
        throw new Error("Server build directory does not exist. Run `npm run build` first.");
    }

    const nestedEntries = readdirSync(serverBuildDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(serverBuildDir, entry.name, "index.js"))
        .filter((entryPath) => existsSync(entryPath));

    if (nestedEntries.length === 0) {
        throw new Error("Could not find a server build entry under `build/server`.");
    }

    return nestedEntries[0];
};

const serverEntry = findServerEntry();
const reactRouterServeCli = join(
    process.cwd(),
    "node_modules",
    "@react-router",
    "serve",
    "dist",
    "cli.js"
);

const child = spawn(process.execPath, [reactRouterServeCli, serverEntry], {
    stdio: "inherit",
    env: process.env,
});

child.on("exit", (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
        return;
    }

    process.exit(code ?? 0);
});
