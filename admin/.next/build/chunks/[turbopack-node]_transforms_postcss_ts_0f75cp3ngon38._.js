module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/admin/postcss.config.js { CONFIG => \"[project]/admin/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/node_modules_20v-8wlfss9m1._.js",
  "chunks/[root-of-the-server]__1zx68zate-il6._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/admin/postcss.config.js { CONFIG => \"[project]/admin/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];