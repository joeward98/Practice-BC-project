import { HttpFunction } from "@google-cloud/functions-framework";

const cartDeletionResponse: HttpFunction = async (req, res) => {
  if (req.method.toUpperCase() === "POST") {
    res.send(`Cart ${req.body.data.id} deleted`);
  }
  res.status(400).send("wrong");
};

export default cartDeletionResponse;
