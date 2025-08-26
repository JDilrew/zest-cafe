import { fork } from "child_process";

class Worker {
  constructor(workerFile) {
    this.workerFile = workerFile;
  }

  run(testFile) {
    return new Promise((resolve, reject) => {
      const child = fork(this.workerFile, [], {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
      });

      child.send(testFile);

      let results = [];

      child.on("message", (msg) => {
        if (msg.event === "run_complete") {
          results = msg.results;
          resolve({ fileName: testFile, results });
          child.kill();
        }
      });

      child.on("error", reject);

      child.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Child exited with code ${code}`));
        }
      });
    });
  }
}

export { Worker };
