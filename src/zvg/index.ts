import {getUrls} from "./queryHelper";
import {sleep} from "./helper";
import {fetchRealEstateList, requestRealEstates} from "./requestHelper";
import {GERICHTE} from "../tools/constants"

const OBJEKTE: number[] = [1, 2, 3, 19, 4];
const OBJEKT_LISTE: number = 4;

export const host = 'https://www.zvg-portal.de/';

const getFormData = (key: string) => {
    const formData = new FormData();
    formData.append('ger_name', key);
    formData.append('order_by', '2');
    formData.append('land_abk', 'nw');
    formData.append('ger_id', (GERICHTE as any)[key]);
    formData.append('az1', '');
    formData.append('az2', '');
    formData.append('az3', '');
    formData.append('az4', '');
    formData.append('art', '');
    formData.append('obj', '');
    formData.append('obj_liste', '4');
    formData.append('str', '');
    formData.append('hnr', '');
    formData.append('plz', '');
    formData.append('ort', '');
    formData.append('ortsteil', '');
    formData.append('vtermin', '');
    formData.append('btermin', '');
    OBJEKTE.forEach(obj => formData.append('obj_arr[]', obj.toString()));
    return formData;
}

const getSearchList = () => {
    return Object.keys(GERICHTE).map((key:string) => ({
        court:key,
        formData: getFormData(key)
    }));
}

export const doZVGSearch = async() => {
    const realEstates = [];
    const searchList = getSearchList();
    for (let searchItem of searchList) {
        const {court, formData} = searchItem;
        try {
            const list = await fetchRealEstateList(host, formData);
            await sleep();
            const urls = await getUrls(list, host);
            const nextRealEstates = await requestRealEstates(urls, host);
            realEstates.push({court, realEstates: nextRealEstates});
        } catch (e) {
            console.log(e);
        }
    }
    return realEstates;

}
