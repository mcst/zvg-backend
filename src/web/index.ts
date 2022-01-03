import express from "express";
import cors from "cors";
import {FileHandler} from "../tools/fileHandler";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors());
export const initServer = () => {
    app.get('/', cors(), async (req, res, next) => {
        const data = await FileHandler.read();
        res.send(data);
    });

    app.get('/zvglink', cors(), async (req, res) => {
        const {query} = req;
        const queryList = [];
        for (let key in query) {
            queryList.push(`${key}=${query[key]}`)
        }
        const queryString = queryList.join("&");
        const url = "http://www.zvg-portal.de/index.php" + "?" + queryString;
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Referer': url,
            }
        });

        const buffer = await data.buffer();
        // saveFile(queryString, buffer);
        res.contentType("application/pdf");
        res.send(buffer);
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

// function saveFile(name: string, buffer: Buffer) {
//     if (!fs.existsSync(`${__dirname}\\downloads`)) {
//         fs.mkdirSync(`${__dirname}\\downloads`);
//     }
//     if (fs.existsSync(`${__dirname}\\downloads\\${name}.pdf`)) {
//         fs.unlinkSync(`${__dirname}\\downloads\\${name}.pdf`);
//     }
//     fs.writeFileSync(`${__dirname}\\downloads\\${name}.pdf`, buffer, {flag: 'wx'});
// }
