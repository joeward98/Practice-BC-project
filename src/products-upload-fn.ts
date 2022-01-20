import { EventFunction } from "@google-cloud/functions-framework";
import { parseAndProcessProductData } from "./helpers";
import { GcpConfig } from "@space48/cloud-seed";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const productsUploadFunction: EventFunction = async ({ name }: { name?: string }) => {
  const bucket = storage.bucket("s48-import-test");
  const file = bucket.file(name!);

  let fileContents = Buffer.alloc(0);

  file
    .createReadStream()
    .on("data", chunk => (fileContents = Buffer.concat([fileContents, chunk])))
    .on("end", () => parseAndProcessProductData(fileContents));
};

export default productsUploadFunction;

export const runtimeConfig: GcpConfig = {
  cloud: "gcp",
  type: "storage",
  bucket: { default: "s48-import-test" },
};
