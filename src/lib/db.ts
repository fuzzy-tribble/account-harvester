import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

export const db = (filename: string) => {
  const config: Config = new Config(`./src/data/${filename}`, true, false, "/");
  const db = new JsonDB(config);
  return db;
};
