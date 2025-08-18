import { fork } from "child_process";

class Worker {
  constructor(workerFile) {
    this.workerFile = workerFile;
  }

  run(jobName, payload) {
    return new Promise((resolve, reject) => {
      const child = fork(this.workerFile, [], {
        stdio: ["inherit", "inherit", "inherit", "ipc"],
      });

      child.send({ jobName, payload });

      child.on("message", (msg) => {
        resolve(msg);
        child.kill();
      });

      child.on("error", (err) => {
        reject(err);
      });

      child.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Child exited with code ${code}`));
        }
      });
    });
  }
}

export { Worker };
