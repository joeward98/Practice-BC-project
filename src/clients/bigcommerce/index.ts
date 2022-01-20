import * as Management from "@space48/bigcommerce-api/lib/management";

require("dotenv").config();

export interface Product {
  sku: string;
  availability: "available" | "disabled";
  name: string;
  type: "physical" | "digital";
  price: number;
  weight: number;
  inventory_level: number;
  custom_fields: { name: string; value: string }[];
}

export class BigCommerce {
  private client: Management.Client;

  constructor(config: Management.Config) {
    this.client = new Management.Client(config);
  }

  public async createProduct(product: Product) {
    return await this.client.v3.post("/catalog/products", { body: product });
  }
}

export const BigCommerceClient = new BigCommerce({
  accessToken: process.env.BIGCOMMERCE_API_ACCESS_TOKEN!,
  storeHash: process.env.BIGCOMMERCE_API_STORE_HASH!,
});
