//local testing only

import { parseAndProcessProductData } from "./helpers";
import fs from "fs";

parseAndProcessProductData(fs.readFileSync("joe-test-catalog copy.csv"));
