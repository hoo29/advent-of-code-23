import fs from "fs";
import path from "path";
import { solve01p1, solve01p2 } from "./d01";
import { solve02p1, solve02p2 } from "./d02";
import { solve03p1, solve03p2 } from "./d03";
import { solve04p1, solve04p2 } from "./d04";
import { solve05p1, solve05p2 } from "./d05";

(() => {
    const test = false;
    const daysDir = path.join(__dirname, "..", "data", "days");
    const day = fs.readdirSync(daysDir).sort().pop();

    if (typeof day === "undefined") {
        throw new Error("immediate failure");
    }

    console.log(`loading day ${day} ${test ? "test" : "input"}`);

    const data = fs
        .readFileSync(path.join(daysDir, day, test ? "test" : "input"))
        .toString()
        .replaceAll("\r", "")
        .trim()
        .split("\n");

    console.time();
    const val = solve05p2(data);
    console.log("answer", val);
    console.timeEnd();
    console.log("done");
})();