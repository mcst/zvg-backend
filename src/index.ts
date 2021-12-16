import {JSDOM} from 'jsdom';
import fetch from 'node-fetch';

type KeyValue = { [key: string]: string | number };
const GERICHTE: KeyValue = {
    BERGHEIM: "R3302",
    BOCHUM: "R2201",
    CASTROP: "R2401",
    DORTMUND: "R2402",
    ESSEN: "R2503",
    KOELN: "R3306",
    HERNE: "R2203",
    HERNE_WANNE:"R2205"
};

const OBJEKTE: number[] = [1, 2, 3, 19, 4];
const OBJEKT_LISTE: number = 4;

(async () => {
    const getObjekte = (Objekte: number[]) => {
        return Objekte.map((nr, index, list) => (`obj_arr%5B%5D=${nr}${index < list.length - 1 ? "&" : ""}`)).join("");
    }
    const host = 'http://www.zvg-portal.de/';
    const searchList: string[] = Object.keys(GERICHTE).map(key => `ger_name=${key}&ger_id=${GERICHTE[key]}&${getObjekte(OBJEKTE)}&obj_liste=${OBJEKT_LISTE}&order_by=2&land_abk=nw&az1=&az2=&az3=&az4=&art=&obj=&str=&hnr=&plz=&ort=&ortsteil=&vtermin=&btermin=`);

    console.log(searchList);

    const sleep = async () => {
        const duration = getRandomInt(2000, 5000);
        return new Promise(res => {
            setTimeout(() => res(true), duration);
        });
    }

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }


    const getUrls = (table: HTMLTableElement): string[] => {
        const rows = table?.querySelectorAll('tr');
        const url = [];
        for (let row of rows) {
            const link = row?.querySelector('a');
            const {href} = link || {};
            if (href?.includes("index.php")) {
                url.push(host + link?.href);
            }
        }
        return url;
    }

    const getRealEstateAktenzeichen = (row: HTMLTableRowElement) => {
        const tds = row.querySelectorAll("td");
        const aktenzeichenHTML = tds[0].querySelector("b")?.innerHTML;
        return aktenzeichenHTML.replace(/&nbsp;/g, '');
    }
    const getRealEstateLastModTime = (row: HTMLTableRowElement) => {
        const tds = row.querySelectorAll("td");
        return tds[1].querySelector("nobr")?.innerHTML;
    }
    const getRealEstate = (htmlText: string): TRealEstate => {
        const {window} = new JSDOM(htmlText);
        const doc = window.document;
        const table = doc.querySelector('table') as HTMLTableElement;
        const rows = table.querySelectorAll('tr');
        const aktenzeichen = getRealEstateAktenzeichen(rows[0]);
        const lastModTime = getRealEstateLastModTime(rows[0]);
        let grundbuch = "";
        let titel = "";
        let verkehrswert = "";
        let termin = "";
        for (let row of rows) {
            const tds = row.querySelectorAll('td');
            const label = tds[0]?.innerHTML;
            if (!grundbuch && label?.includes("Grundbuch")) {
                grundbuch = tds[1]?.innerHTML;
            } else if (!titel && label?.includes("Objekt/Lage:")) {
                const objekt = tds[1].querySelector("b").innerHTML;
                const tdSplit = tds[1].innerHTML.split("</b>");
                const anschrift = tdSplit[1]?.trim();
                titel = `${objekt},${anschrift}`;
            } else if (!verkehrswert && label?.includes("Verkehrswert")) {
                verkehrswert = tds[1].innerHTML?.replace("insgesamt:", "");
            } else if (!termin && label?.includes("Termin")) {
                termin = tds[1].querySelector("b")?.innerHTML;
            }
        }
        return {aktenzeichen, lastModTime, grundbuch, titel, verkehrswert, termin};
    }

    type TRealEstate = {
        lastModTime: string;
        titel: string;
        verkehrswert: string;
        grundbuch: string;
        aktenzeichen: string,
        termin: string
    }
    const requestRealEstates = async (urls: string[]) => {
        const realEstates: TRealEstate[] = []
        for (let url of urls) {
            await sleep();
            const res = await fetch(url, {
                headers: {
                    'Referer': host + 'index.php?button=Suchen'
                }
            });
            const realEstate = getRealEstate(await res.text())
            console.log(realEstate)
            realEstates.push(realEstate);
        }
        return realEstates;
    }

    const getObjects = async (htmlText: string) => {
        const {window} = new JSDOM(htmlText);
        const doc = window.document;
        const tables = doc.querySelectorAll('table');
        const midTable = tables[1];
        const table = midTable ?? tables[0];
        const urls = getUrls(table);
        return await requestRealEstates(urls);
    }
    for (let searchString of searchList) {
        const res = await fetch(host + 'index.php?button=Suchen&all=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: searchString
        });
        await sleep();
        console.log(searchString);
        await getObjects(await res.text());
    }

})();
