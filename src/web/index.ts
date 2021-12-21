import express from "express";
import cors from "cors";
import {FileHandler} from "../tools/fileHandler";
import fetch from "node-fetch";
import {host} from "../zvg";
const app = express();
const port = 3000;
// app.use(express.static('public'));

app.use(cors());
export const initServer = () => {
    app.get('/', cors(), async(req, res, next) => {
        const data = await FileHandler.read();
        res.send(data);
    });

    app.get('/zvglink', cors(), async(req, res)=>{
        const {query} = req;
        const queryList = [];
        for (let key in query){
            queryList.push(`${key}=${query[key]}`)
        }
        const queryString = queryList.join("&");
        const url = "http://www.zvg-portal.de/index.php" + "?"+  queryString;
        console.log("url", url);
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf'
            }
        });
        console.log(data);
        res.contentType("application/pdf");
        res.send(data.body)
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}
