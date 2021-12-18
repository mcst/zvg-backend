import {sleep} from "./helper";
import fetch from "node-fetch";
import {getRealEstate} from "./queryHelper";

export const requestRealEstates = async (urls: string[], host:string) => {
    const realEstates = []
    for (let url of urls) {
        await sleep();
        const res = await fetch(url, {
            headers: {
                'Referer': host + 'index.php?button=Suchen'
            }
        });
        const realEstate = getRealEstate(await res.text());
        realEstates.push(realEstate);
    }
    return realEstates;
}

export const fetchRealEstateList = async (host:string, formString:string) => {
   return await fetch(host + 'index.php?button=Suchen&all=1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formString
    });
}
