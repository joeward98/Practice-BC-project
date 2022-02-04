import { parse } from "csv-parse";
import { BigCommerceClient } from "./clients/bigcommerce";
import { PubSub } from "@google-cloud/pubsub";

interface RawProduct {
  SKU: string;
  Available: string;
  "Product Name": string;
  Price: string;
  Weight: string;
  "Inventory Level": string;
  "Country Restriction": string;
  "FE Sash Message": string;
}

const processProducts = async (products: RawProduct[]) =>
  Promise.all(
    products.map(product =>
      BigCommerceClient.upsertProduct({
        sku: product["SKU"],
        availability: product["Available"] == "Yes" ? "available" : "disabled",
        name: product["Product Name"],
        type: "physical",
        price: Number(product["Price"]),
        weight: Number(product["Weight"]),
        inventory_level: Number(product["Inventory Level"]),
        custom_fields: [
          { name: "country_restriction", value: product["Country Restriction"] },
          { name: "FE_sash_message", value: product["FE Sash Message"] },
        ],
      }),
    ),
  );

export const parseAndProcessProductData = (productsDataCSV: Buffer) => {
  parse(productsDataCSV, { columns: true }, async (error: any, products: RawProduct[]) => {
    if (error) console.log(error);
    else await processProducts(products);
  });
};

const pubSub = new PubSub();

export const publish = async (topic: string, message: string) => {
  const dataBuffer = Buffer.from(JSON.stringify(message));
  //await pubSub.topic(topic).publish(dataBuffer);
  await pubSub.topic(topic).publish(dataBuffer, () => {
    console.log("published message");
  });
};
