import archiver from "archiver";
import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";
import rimraf from "rimraf";

const DIST_DIR = "../dist";

async function startZipping() {
  console.log("--- Creating Lambda Archives ---");

  const lambdas = await readdir(path.join(__dirname, DIST_DIR));
  const lambdaPaths = lambdas.map((name) =>
    path.join(__dirname, DIST_DIR, name)
  );

  let lambdaZips: any[] = [];

  for (const lambda of lambdaPaths) lambdaZips.push(zip(lambda));
  await Promise.all(lambdaZips);
  console.log("Lambda zip archives created successfully");

  console.log("Cleaning up");
  lambdaZips = [];
  for (const lambda of lambdaPaths) lambdaZips.push(deleteRecursively(lambda));

  await Promise.all(lambdaZips);
  console.log("Cleanup complete");
}

function zip(lambda: string) {
  return new Promise((resolve) => {
    const archive = archiver.create("zip");
    const zipOut = fs.createWriteStream(`${lambda}.zip`);
    // const zipOut = fs.createWriteStream(`${lambda}-${new Date().getTime()}.zip`);

    archive.pipe(zipOut);
    zipOut.on("close", () => {
      resolve(true);
    });
    archive.directory(`${lambda}`, false).finalize();
  });
}

function deleteRecursively(filePath: string) {
  return new Promise((resolve) => {
    rimraf(filePath, () => {
      resolve(true);
    });
  });
}

startZipping()
  .then(() => {
    console.log("--- Zipped Lambdas successfully ---");
  })
  .catch((error) => {
    console.log("--- Error encountered while zipping Lambdas ---", error);
  });
