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
    const realEstate: TRealEstate = {
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
        } else if (!realEstate.googleMaps && label?.toLowerCase()?.includes("googlemaps")) {
            realEstate.googleMaps = tds[1].querySelector("a")?.href
        } else if (!realEstate.exposee && label?.toLowerCase()?.includes("exposee")) {
            const link = tds[1].querySelector("a");
            if (link?.innerHTML?.toLowerCase()?.includes("pdf")) {
                realEstate.exposee = link.href?.split("?")[1];
            }
        } else if (!realEstate.foto && label?.toLowerCase()?.includes("foto")) {
            const link = tds[1].querySelector("a");
            if (link?.innerHTML?.toLowerCase()?.includes("pdf")) {
                realEstate.foto = link.href?.split("?")[1];
            }
        } else if (!realEstate.gutachten && label?.toLowerCase()?.includes("gutachten")) {
            const link = tds[1].querySelector("a");
            if (link?.innerHTML?.toLowerCase()?.includes("pdf")) {
                realEstate.gutachten = link.href?.split("?")[1];
            }
        }
    }
    return realEstate;
}

type TRealEstate = {
    lastModTime?: string
    titel?: string
    verkehrswert?: string
    grundbuch?: string
    aktenzeichen?: string
    termin?: string
    adresse?: string
    googleMaps?: string
    exposee?: string
    gutachten?: string
    foto?: string
}

export const getUrls = async (htmlContent: string, host: string) => {

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const tables = document.querySelectorAll('table');
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
