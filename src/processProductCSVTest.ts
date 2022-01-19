import fs from "fs";
import { parse } from "csv-parse";

const productsCSV = fs.readFileSync(
  "/Users/josephward/Documents/Work/Grad_Scheme_Training/Bigcommerce-training/joes-practice-BC-project/joe-test-catalog.csv",
);

parse(productsCSV, { columns: true }, (_, res) => console.log(JSON.stringify(res)));
