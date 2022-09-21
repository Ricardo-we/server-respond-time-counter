var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import colors from "colors";
import readline from "node:readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function commandInputLabeled(rl, label) {
    return new Promise((resolve, reject) => {
        rl.question(label, (response) => {
            if (response.length < 0)
                reject("Response should be at least 1  caracter long");
            resolve(response);
        });
    });
}
function attackCount({ times = 50, apiUrl = "http://localhost:8000/api/tasks/1", token, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.time(`AttackTimer`);
        for (let i = 0; i <= times; i++) {
            try {
                const jsonResponse = yield axios.get(apiUrl, {
                    headers: { Authorization: "Bearer " + token },
                });
                console.info({
                    jsonResponse: jsonResponse.data,
                    count: i,
                });
            }
            catch (error) {
                console.error("Woops.. ", error);
            }
        }
        console.timeEnd(`AttackTimer`);
    });
}
function attack({ times = 50, apiUrl = "http://localhost:8000/api/tasks/1", token, }) {
    return Promise.all(Array.from(Array(times).keys()).map(() => axios.get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
    })));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        colors.enable();
        try {
            const times = parseInt(yield commandInputLabeled(rl, "How many times do you want to attack? ".cyan));
            const apiUrl = yield commandInputLabeled(rl, "Api url and endpoint to attack ".cyan);
            const token = yield commandInputLabeled(rl, "Do you need a token? write it here: ".cyan);
            yield attackCount({ times, apiUrl, token });
            return 0;
        }
        catch (error) {
            console.error(error);
        }
    });
}
main();
