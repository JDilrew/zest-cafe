import chalk from "chalk";
import path from "path";

const orange = chalk.hex("#FFA500");

function reportResult(result) {
  const passed = result.results.every((e) => e.status === "passed");
  const status = passed
    ? chalk.green.inverse.bold(" PASS ")
    : orange.inverse.bold(" FAIL ");

  const fullPath = result.fileName;
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath); // file name + extension

  const displayPath = (dir === "." ? "" : chalk.dim(dir + path.sep)) + base;

  console.log(status + " " + displayPath);

  // individual case results
  for (const { name, status, error } of result.results) {
    const isPassed = status === "passed";
    const icon = isPassed ? chalk.green("√") : orange("X");
    const errorMsg = error ? ` ${orange(error)}` : "";

    console.log("  ", icon, chalk.gray(name), errorMsg);
  }
}

export { reportResult };
