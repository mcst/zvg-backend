import express from "express";
import cors from "cors";
import {FileHandler} from "../tools/fileHandler";
const app = express();
const port = 3000;
// app.use(express.static('public'));

app.use(cors());
export const initServer = () => {
    app.get('/', cors(), async(req, res, next) => {
        const data = await FileHandler.read();
        res.send(data);
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}
