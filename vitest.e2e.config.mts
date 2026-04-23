import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@app": path.resolve(__dirname, "./src/app"),
            "@root": path.resolve(__dirname, "./src"),
            "@auth": path.resolve(__dirname, "./src/app/auth"),
            "@shared": path.resolve(__dirname, "./src/app/@shared"),
            "@billing": path.resolve(__dirname, "./src/app/billing"),
            "@env": path.resolve(__dirname, "./src/config/env"),
            "@mock": path.resolve(__dirname, "./test/mock"),
        },
    },
    test: {
        include: [ "test/**/*.e2e-spec.ts" ],
        environment: "node",
        setupFiles: [ "./test/vitest.setup.ts" ],
    },
});
