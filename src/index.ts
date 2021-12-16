import {JSDOM} from 'jsdom';
import fetch from 'node-fetch';

type KeyValue = { [key: string]: string | number };
const GERICHTE: KeyValue = {
    BERGHEIM: "R3302",
    BOCHUM: "R2201",
    CASTROP: "R2401",
    DORTMUND: "R2402",
    ESSEN: "R2503",
    KOELN: "R3306"
};

const OBJEKTE: number[] = [1, 2, 3, 19, 4];
const OBJEKT_LISTE: number = 4;

(async () => {
    const getObjekte = (Objekte:number[]) => {
        return Objekte.map((nr,index, list)=>(`obj_arr%5B%5D=${nr}${index<list.length-1?"&":""}`)).join("");
    }
    const host = 'http://www.zvg-portal.de/';
    const searchList:string[] = Object.keys(GERICHTE).map(key => `ger_name=${key}&ger_id=${GERICHTE[key]}&${getObjekte(OBJEKTE)}&obj_liste=${OBJEKT_LISTE}&order_by=2&land_abk=nw&az1=&az2=&az3=&az4=&art=&obj=&str=&hnr=&plz=&ort=&ortsteil=&vtermin=&btermin=`);

    console.log(searchList);

    const sleep = async(duration:number) =>{
        return new Promise(res=>{
           setTimeout(()=>res(true),duration);
        });
    }
    function getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }



    const getUrl = (table:HTMLTableElement) =>{
        const rows= table?.querySelectorAll('tr');

        const url = [];
        for(let row of rows){
            const link = row?.querySelector('a');
            const {href} = link||{};
            if(href?.includes("index.php")) {
                url.push(host +link?.href);
            }
        }
        return url;
    }

    const checkResponse = (htmlText:string) => {
        const {window} = new JSDOM(htmlText);
        const doc = window.document;
        const tables = doc.querySelectorAll('table');
        const midTable = tables[1];
        const table = midTable ?? tables[0];
        console.log(getUrl(table));
    }
    for(let searchString of searchList){
        const res = await fetch(host + 'index.php?button=Suchen&all=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchString
        });
        await sleep(getRandomInt(500,2000));
        console.log(searchString);
        checkResponse(await res.text());
    }

    // const res2 = await fetch(urls[0], {
    //     headers: {
    //         'Referer': host + 'index.php?button=Suchen'
    //     }
    // });
    // console.log(await res2.text());
})();
