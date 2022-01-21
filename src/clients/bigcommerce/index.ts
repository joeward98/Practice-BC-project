import * as Management from "@space48/bigcommerce-api/lib/management";

require("dotenv").config();

export interface Product {
  sku: string | undefined;
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

  public async upsertProduct(product: Product) {
    const matchingProduct = await this.client.v3.get("/catalog/products", {
      query: { "sku:in": [product.sku] },
    });
    const { custom_fields, ...productStandardFields } = product;

    if (matchingProduct?.length) {
      await this.client.v3.put("/catalog/products/{product_id}", {
        body: productStandardFields,
        path: { product_id: matchingProduct[0].id },
      });

      const customFields = await this.client.v3.get(
        "/catalog/products/{product_id}/custom-fields",
        {
          path: { product_id: matchingProduct[0].id },
        },
      );

      const updateCustomFieldPromises = customFields?.map((field, index) =>
        this.client.v3.put("/catalog/products/{product_id}/custom-fields/{custom_field_id}", {
          body: {
            name: product.custom_fields[index].name,
            value: product.custom_fields[index].value,
          },
          path: { product_id: matchingProduct[0].id, custom_field_id: field.id },
        }),
      );
      return Promise.all(updateCustomFieldPromises!);
    }
    return await this.client.v3.post("/catalog/products", { body: product });
  }
}

export const BigCommerceClient = new BigCommerce({
  accessToken: process.env.BIGCOMMERCE_API_ACCESS_TOKEN!,
  storeHash: process.env.BIGCOMMERCE_API_STORE_HASH!,
});
