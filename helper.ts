import { ethers, Logger } from "./deps.ts"

export const Freiheit = "0x099471B71c9D8b0C6b616eE9A7C645e22cA9cfF7" 
export const Friede = "0x0715184614CA1e90EafDf7A4d7fE33B046b47C02" // on Polygon POS
export const Geld = "0xb841A4f979F9510760ecf60512e038656E68f459" // on Polygon POS
export const Matic = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" // on Polygon POS
export const FreedomSwapsCA = "0xA70f5023801F06A6a4C04695E794cf6e2ecCb34F" // on Polygon POS
// export const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
// export const CA = "0xE3Ee93AA1B66f491C427439dC483911558F42D9e"

let loggerInstance: Logger

export async function getLogger() {
    if (loggerInstance === undefined) {
        const minLevelForConsole = 'DEBUG'
        // const minLevelForConsole = 'INFO'
        const minLevelForFile = 'WARNING'
        const fileName = "./warnings-errors.txt"
        const pureInfo = true // leaving out e.g. the time info
        loggerInstance = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
    }
    return loggerInstance
}
export function getProvider(logger: Logger, providerURL: string) {
    return new ethers.JsonRpcProvider(providerURL)
}
export async function getContract(contractAddress: string, contractABI: any, provider: any, pkTestWallet: string): Promise<any> {
    // const signer = await provider.getSigner()
    const wallet = new ethers.Wallet(pkTestWallet, provider)
    const signer = await wallet.connect(provider)
    return new ethers.Contract(contractAddress, contractABI, signer)
}
export function itsAKindOfMagic() {

    const precision = 360
    let counter = 0
    let result = 0

    return g(precision, counter, result)
}

function g(precision, counter, result) {
    counter++
    if (counter === precision) {
        return result
    } else {
        return 1 + 1 / g(precision, counter, result)
    }
}
