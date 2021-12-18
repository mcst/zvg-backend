import {getUrls} from "./queryHelper";
import {sleep} from "./helper";
import {fetchRealEstateList, requestRealEstates} from "./requestHelper";

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

const host = 'http://www.zvg-portal.de/';

const getObjekte = (Objekte: number[]) => {
    return Objekte.map((nr, index, list) => (`obj_arr%5B%5D=${nr}${index < list.length - 1 ? "&" : ""}`)).join("");
}

const getSearchList = () => {
    return Object.keys(GERICHTE).map(key => ({
        path: `ger_name=${key}&ger_id=${GERICHTE[key]}&${getObjekte(OBJEKTE)}&obj_liste=${OBJEKT_LISTE}&order_by=2&land_abk=nw&az1=&az2=&az3=&az4=&art=&obj=&str=&hnr=&plz=&ort=&ortsteil=&vtermin=&btermin=`,
        court: key
    }));
}

export const doZVGSearch = async() => {
    const realEstates = [];
    const searchList = getSearchList();
    for (let searchItem of searchList) {
        const {court, path} = searchItem;
        const res = await fetchRealEstateList(host, path);
        await sleep();
        const urls = await getUrls(await res.text(), host);
        const nextRealEstates = await requestRealEstates(urls, host);
        realEstates.push({court, realEstates: nextRealEstates});
    }
    return realEstates;
}
