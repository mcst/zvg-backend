import {sleep} from "./helper";
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

export const fetchRealEstateList = async (host:string, formData:FormData) => {
    let htmlText = "";
    try {
        const response = await fetch(host + 'index.php?button=Suchen', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            htmlText = await response.text();

        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Fetch-Error:', error);
    }
    return htmlText;
}
