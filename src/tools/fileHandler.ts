import fs from "fs";

const fileName = "./zvg-objects.json"

  class FileHandler {
    static actions: any = [];

    static executeCall = async () => {
        if(!this.actions) this.actions =  [];
        console.log("executeCall", JSON.stringify(this.actions));
        const action = this.actions[0];
        if (action) {
            await action();
            this.actions.splice(0, 1);
            if (this.actions.length > 0) {
                await this.executeCall();
            }
        }
    }
    static write = async (data: string) => {
        console.log("write data", JSON.stringify(data));
        this.actions.push(() => fs.writeFileSync(fileName, data));
        await this.executeCall();
    }
    static read = async () => {
        const self = this;
        return new Promise((res, rej) => {
            self.actions.push(() => res(fs.readFileSync(fileName)));
            self.executeCall();
        });
    }
}

export {FileHandler};
