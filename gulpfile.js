const fs                = require("fs");
const gulp              = require("gulp");
const path              = require("path");
const del               = require("del");
const gh                = require("gulp-helpers");
const Promise           = require("bluebird");
const stripJsonComments = require("strip-json-comments");


////////////////////////////////////////////////////////////////////////////////
// default
////////////////////////////////////////////////////////////////////////////////
gulp.task("default", function () {
    "use strict";

    const usage = [
        "Gulp tasks:",
        "  clean  - Deletes built files",
        "  tslint - Run TSLint on source files",
        "  build  - Build this project",
        "  ut     - Build and run this project's unit tests"
    ];

    console.log(usage.join("\n"));
});


////////////////////////////////////////////////////////////////////////////////
// clean
////////////////////////////////////////////////////////////////////////////////
gulp.task("clean", function () {
    "use strict";

    del.sync(["dist", "tmp"]);
});


////////////////////////////////////////////////////////////////////////////////
// tslint
////////////////////////////////////////////////////////////////////////////////
gulp.task("tslint", function () {
    "use strict";

    return runTslint(false);

});


function runTslint(emitError) {
    "use strict";

    const tslint     = require("tslint");
    const gulpTslint = require("gulp-tslint");

    return gulp.src(getSrcGlobs(true))
    .pipe(gulpTslint(
        {
            // Use the version of tslint specified in package.json, not the one
            // bundled with gulp-tslint.
            tslint:    require("tslint"),
            // Some TSLint rules require type information.  A TypeScript program
            // object is needed to provide this.
            program:   tslint.Linter.createProgram(path.join(__dirname, "tsconfig.json")),
            formatter: "stylish"
        }
    ))
    .pipe(gulpTslint.report(
        {
            emitError: emitError
        }
    ));
}

////////////////////////////////////////////////////////////////////////////////
// build
////////////////////////////////////////////////////////////////////////////////

gulp.task("build", ["clean", "tslint"], function () {
    "use strict";
    return buildJs();
});


function getSrcGlobs(includeUnitTestFiles) {
    "use strict";

    const srcGlobs = [
        "src/**/*.ts"
    ];

    if (!includeUnitTestFiles) {
        srcGlobs.push("!src/**/*.spec.ts");
        srcGlobs.push("!src/test/**/*");
    }

    return srcGlobs;
}

function getTsConfig(emitDeclarationFiles) {
    "use strict";

    const tsConfigFile = path.join(__dirname, "tsconfig.json");
    const tsConfigJsonText = fs.readFileSync(tsConfigFile, "utf8");
    const compilerOptions = JSON.parse(stripJsonComments(tsConfigJsonText)).compilerOptions;
    compilerOptions.declaration = !!emitDeclarationFiles;
    compilerOptions.typescript = require("typescript");
    return compilerOptions;
}

function buildJs() {
    "use strict";

    const ts         = require("gulp-typescript");
    const sourcemaps = require("gulp-sourcemaps");
    const outDir     = path.join(__dirname, "dist");

    const tsResults = gulp.src(getSrcGlobs(false))
        .pipe(sourcemaps.init())
        .pipe(ts(getTsConfig(true), ts.reporter.longReporter()));

    const jsStream = tsResults.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outDir));

    const defsStream = tsResults.dts
        .pipe(gulp.dest(outDir));

    return gh.streamsToPromise(jsStream, defsStream);
}


////////////////////////////////////////////////////////////////////////////////
// ut
////////////////////////////////////////////////////////////////////////////////
gulp.task("ut", function () {
    "use strict";

    const outDir = path.join(__dirname, "tmp", "ut");

    return gh.streamsToPromise(runTslint(false))
    .then(() => {
        const ts = require("gulp-typescript");
        const sourcemaps = require("gulp-sourcemaps");

        let numErrors = 0;

        const tsResults = gulp.src(getSrcGlobs(true))
        .pipe(sourcemaps.init())
        .pipe(ts(getTsConfig(false), ts.reporter.longReporter()));

        tsResults.on("error", () => {
            numErrors++;
        });

        const jsStream = tsResults.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outDir));

        const defsStream = tsResults.dts
        .pipe(gulp.dest(outDir));

        return gh.streamsToPromise(jsStream, defsStream)
        .then(() => {
            if (numErrors > 0) {
                throw new Error("TypeScript compilation failed.");
            }
        });
    })
    .then(() => {
        // Run Mocha.
        return spawn("./node_modules/.bin/mocha", ['./tmp/**/*.spec.js']);
    });

});


function spawn(cmd, args) {
    "use strict";

    return new Promise((resolve, reject) => {
        const cp = require("child_process");

        // cwd - All commands are executed relative to the root of this project
        //     (where this file lives)
        // stdio - I/O streams from the spawned command are piped directly to
        //     this process's I/O streams.  This allows colors to pass
        //     through
        const proc = cp.spawn(cmd, args, {cwd: __dirname, stdio: "inherit"});

        proc.once("exit", (exitCode) => {
            if (exitCode === 0) {
                resolve();
            } else {
                reject();
            }
        });

    });

}
