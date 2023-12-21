/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { solve01p1, solve01p2 } from "./d01";
import { solve02p1, solve02p2 } from "./d02";
import { solve03p1, solve03p2 } from "./d03";
import { solve04p1, solve04p2 } from "./d04";
import { solve05p1, solve05p2 } from "./d05";
import { solve06p1, solve06p2 } from "./d06";
import { solve07p1, solve07p2 } from "./d07";
import { solve08p1, solve08p2 } from "./d08";
import { solve09p1, solve09p2 } from "./d09";
import { solve10p1, solve10p2 } from "./d10";
import { solve11p1, solve11p2 } from "./d11";
import { solve12p1, solve12p2 } from "./d12";
import { solve13p1, solve13p2 } from "./d13";
import { solve14p1, solve14p2 } from "./d14";
import { solve15p1, solve15p2 } from "./d15";
import { solve16p1, solve16p2 } from "./d16";
import { solve17p1, solve17p2 } from "./d17";
import { solve18p1, solve18p2 } from "./d18";
import { solve19p1, solve19p2 } from "./d19";
import { solve20p1, solve20p2 } from "./d20";
import { solve21p1, solve21p2 } from "./d21";

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
    const val = solve21p2(data);
    console.log("answer", Number(val).toLocaleString("fullwide", { useGrouping: false }));
    console.timeEnd();
    console.log("done");
})();
