import {JSDOM} from "jsdom";

const getAktenzeichen = (row: HTMLTableRowElement) => {
    const tds = row.querySelectorAll("td");
    const aktenzeichenHTML = tds[0].querySelector("b")?.innerHTML;
    return aktenzeichenHTML.replace(/&nbsp;/g, '');
}
const getLastModTime = (row: HTMLTableRowElement) => {
    const tds = row.querySelectorAll("td");
    return tds[1].querySelector("nobr")?.innerHTML;
}
export const getRealEstate = (htmlText: string): TRealEstate => {
    const {window} = new JSDOM(htmlText);
    const doc = window.document;
    const table = doc.querySelector('table') as HTMLTableElement;
    const rows = table.querySelectorAll('tr');
    const realEstate: TRealEstate= {
        aktenzeichen: getAktenzeichen(rows[0]),
        lastModTime: getLastModTime(rows[0]),
    }
    for (let row of rows) {
        const tds = row.querySelectorAll('td');
        const label = tds[0]?.innerHTML;
        if (!realEstate.grundbuch && label?.includes("Grundbuch")) {
            realEstate.grundbuch = tds[1]?.innerHTML;
        } else if (!realEstate.titel && label?.includes("Objekt/Lage:")) {
            const objekt = tds[1].querySelector("b").innerHTML;
            const tdSplit = tds[1].innerHTML.split("</b>");
            const anschrift = tdSplit[1]?.trim();
            realEstate.titel = `${objekt} ${anschrift}`;
        } else if (!realEstate.verkehrswert && label?.includes("Verkehrswert")) {
            realEstate.verkehrswert = tds[1].innerHTML?.replace("insgesamt:", "");
        } else if (!realEstate.termin && label?.includes("Termin")) {
            realEstate.termin = tds[1].querySelector("b")?.innerHTML;
        }
    }
    return realEstate;
}

type TRealEstate = {
    lastModTime?: string;
    titel?: string;
    verkehrswert?: string;
    grundbuch?: string;
    aktenzeichen?: string,
    termin?: string
}

export const getUrls = async (htmlText: string, host:string) => {
    const {window} = new JSDOM(htmlText);
    const doc = window.document;
    const tables = doc.querySelectorAll('table');
    const midTable = tables[1];
    const table = midTable ?? tables[0];
    const rows = table?.querySelectorAll('tr');
    const urls = [];
    for (let row of rows) {
        const link = row?.querySelector('a');
        const {href} = link || {};
        if (href?.includes("index.php")) {
            urls.push(host + link?.href);
        }
    }
    return urls;
}
