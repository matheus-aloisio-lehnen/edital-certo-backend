// @ts-check
import eslint from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
    {
        ignores: ["dist/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        files: ["**/*.ts"],
        plugins: {
            "@stylistic": stylistic,
            import: importPlugin,
            "unused-imports": unusedImports,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            sourceType: "module",
        },
        rules: {
            "@stylistic/array-bracket-spacing": ["error", "never"],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "@stylistic/max-len": [
                "error",
                {
                    code: 160,
                    ignorePattern: "^import\\s.+",
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreUrls: true,
                },
            ],
            "@stylistic/multiline-ternary": ["error", "always"],
            "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 1 }],
            "@stylistic/nonblock-statement-body-position": ["error", "below"],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/operator-linebreak": ["error", "before"],
            "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/space-in-parens": ["error", "never"],
            "@stylistic/template-curly-spacing": ["error", "always"],
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    default: [
                        "static-field",
                        "private-instance-field",
                        "protected-instance-field",
                        "public-instance-field",
                        "constructor",
                        "instance-method",
                    ],
                },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowTernary: true,
                },
            ],
            "arrow-body-style": ["error", "as-needed"],
            curly: "off",
            "import/order": [
                "error",
                {
                    alphabetize: { caseInsensitive: true, order: "asc" },
                    distinctGroup: false,
                    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
                    "newlines-between": "always",
                    pathGroups: [
                        { group: "internal", pattern: "@app/**", position: "before" },
                        { group: "internal", pattern: "@auth/**", position: "before" },
                        { group: "internal", pattern: "@billing/**", position: "before" },
                        { group: "internal", pattern: "@cfg/**", position: "before" },
                        { group: "internal", pattern: "@env/**", position: "before" },
                        { group: "internal", pattern: "@mock/**", position: "before" },
                        { group: "internal", pattern: "@shared/**", position: "before" },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                },
            ],
            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        files: ["**/*.spec.ts", "test/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.vitest,
            },
        },
    },
);
