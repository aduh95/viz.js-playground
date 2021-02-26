import readline from "node:readline";
import { createReadStream, createWriteStream, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import webpack from "webpack";

const PUBLIC_FOLDER = new URL("../public/", import.meta.url);
const outputFilename = "ace.bundle.js";

const out = mkdtempSync(path.join(os.tmpdir(), "webpack-"));

webpack(
  {
    mode: "production",
    entry: "./public/ace.js",
    target: "web",
    experiments: {
      outputModule: true,
    },
    output: {
      filename: outputFilename,
      path: out,
      module: true,
      clean: false,
    },
    optimization: {
      minimize: false,
    },
  },
  async (err) => {
    if (err) return console.error(err);
    const beforeExports = /var __webpack_exports__ = {};/;
    const defaultExportStart = /^\/\* unused harmony default export \*\/\s*var __WEBPACK_DEFAULT_EXPORT__ =/;
    const input = createReadStream(path.join(out, outputFilename));
    const output = createWriteStream(
      new URL(`./${outputFilename}`, PUBLIC_FOLDER)
    );
    for await (const line of readline.createInterface({
      input,
      crlfDelay: Infinity,
    })) {
      if (defaultExportStart.test(line)) {
        output.write(
          line.replace(defaultExportStart, "return").replace("null &&", "")
        );
      } else {
        output.write(line);
      }
      if (beforeExports.test(line)) {
        output.write("export default");
      }
      output.write("\n");
    }
  }
);
