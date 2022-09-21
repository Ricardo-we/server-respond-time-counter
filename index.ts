import axios from "axios";
import colors from "colors";
import readline from "node:readline";

interface BaseAttack {
    times: number;
    apiUrl: string;
    token: string;
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function commandInputLabeled(rl: readline.Interface, label: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question(label, (response) => {
            if (response.length < 0) reject("Response should be at least 1  caracter long")
            resolve(response)
        });
    })

}

async function attackCount({
    times = 50,
    apiUrl = "http://localhost:8000/api/tasks/1",
    token,
}: BaseAttack) {
    console.time(`AttackTimer`);
    for (let i = 0; i <= times; i++) {
        try {
            const jsonResponse = await axios.get(apiUrl, {
                headers: { Authorization: "Bearer " + token },
            });
            console.info({
                jsonResponse: jsonResponse.data,
                count: i,
            });
        } catch (error) {
            console.error("Woops.. ", error);
        }
    }
    console.timeEnd(`AttackTimer`);
}

function attack({
    times = 50,
    apiUrl = "http://localhost:8000/api/tasks/1",
    token,
}: BaseAttack) {
    return Promise.all(
        Array.from(Array(times).keys()).map(() =>
            axios.get(apiUrl, {
                headers: { Authorization: "Bearer " + token },
            }),
        ),
    );
}

async function main() {
    colors.enable();
    try {
        const times = parseInt(await commandInputLabeled(rl, "How many times do you want to attack? ".cyan));
        const apiUrl = await commandInputLabeled(rl, "Api url and endpoint to attack ".cyan);
        const token = await commandInputLabeled(rl, "Do you need a token? write it here: ".cyan);
        await attackCount({ times, apiUrl, token });

        return 0;
    } catch (error) {
        console.error(error)
    }
}

main();