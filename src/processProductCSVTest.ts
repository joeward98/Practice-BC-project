import { parseAndProcessProductData } from "./helpers";
import fs from "fs";

parseAndProcessProductData(fs.readFileSync("joe-test-catalog.csv"));
