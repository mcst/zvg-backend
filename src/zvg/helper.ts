export const sleep = async () => {
    const duration = getRandomInt(2000, 5000);
    return new Promise(res => {
        setTimeout(() => res(true), duration);
    });
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
