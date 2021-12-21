import {doZVGSearch} from "./zvg";
import {initServer} from "./web";
import {FileHandler} from "./tools/fileHandler";

(async()=> {
    initServer();
    // const zvgData = await doZVGSearch();
    // await FileHandler.write(JSON.stringify(zvgData));
})();
