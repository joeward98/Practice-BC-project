import fs from "fs";
import { parse } from "csv-parse";
import { BigCommerceClient } from "./clients/bigcommerce";
import type { Product } from "./clients/bigcommerce";

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

const productsCSV = fs.readFileSync(
  "/Users/josephward/Documents/Work/Grad_Scheme_Training/Bigcommerce-training/joes-practice-BC-project/joe-test-catalog.csv",
);

const processProduct = async (_: any, products: RawProduct[]) =>
  Promise.all(
    products.map(product =>
      BigCommerceClient.createProduct({
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

parse(productsCSV, { columns: true }, async (_: any, products: RawProduct[]) => {
  await processProduct(_, products);
});
