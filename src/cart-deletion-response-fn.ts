import { HttpFunction } from "@google-cloud/functions-framework";
import { GcpConfig } from "@space48/cloud-seed";

const cartDeletionResponse: HttpFunction = async (req, res) => {
  if (req.method.toUpperCase() === "POST") {
    console.log(`Cart ${req.body.data.id} deleted`);
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
};

export default cartDeletionResponse;

export const runtimeConfig: GcpConfig = {
  cloud: "gcp",
  type: "http",
  public: true,
};
