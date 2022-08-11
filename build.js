import { Client } from "discord.js";
import { rename, readFile, writeFile, unlink } from "fs";
import { resolve } from "path";
import { env, exit } from "process";

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
    if (!env.USE_NETLIFY_FORMS) {
        const submissionOldFunction = resolve(__dirname, "func", "submission-created.js");
        const submissionNewFunction = resolve(__dirname, "func", "submit-appeal.js");
        rename(submissionOldFunction, submissionNewFunction, err => {
            if (err) {
                console.log(err);
                exit(1);
            }
        });

        const form = resolve(__dirname, "public", "form.html");
        readFile(form, "UTF-8", (err, data) => {
            if (err) {
                console.log(err);
                exit(1);
            }

            data = data.replace("action=\"/success\" netlify", "action=\"/.netlify/functions/submit-appeal\"");
            writeFile(form, data, "UTF-8", err => {
                if (err) {
                    console.log(err);
                    exit(1);
                }
            });
        });
    }

    if (env.DISABLE_UNBAN_LINK) {
        const unban = resolve(__dirname, "func", "unban.js");
        unlink(unban, err => {
            if (err) {
                console.log(err);
                exit(1);
            }
        });
    }

    // Make sure the bot connected to the gateway at least once.
    const client = new Client({
        intents: 0x1ffff
    });
    try {
        await client.login(env.DISCORD_BOT_TOKEN);
    } catch (e) {
        console.log(e);
        exit(1);
    }
    client.destroy();
}

main();