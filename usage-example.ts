import { Distributor } from "./Distributor.ts"

const minSleep = Deno.args[0]
const maxSleep = Deno.args[1]
const providerURL = Deno.args[2]
const pkTestWallet = Deno.args[3]
const amountOfBaseCurrencyToKeepInEachWallet = Deno.args[4]

console.log(amountOfBaseCurrencyToKeepInEachWallet)
if (minSleep == undefined || maxSleep == undefined || minSleep < 9) {
    throw new Error(`you might consider sleeping when the time is right`)
} else if (amountOfBaseCurrencyToKeepInEachWallet == undefined) {
    throw new Error(`you might consider experimenting with specific small amounts`)
} else if (providerURL === undefined || pkTestWallet === undefined) {
    throw new Error("configuration parameter missing")
} else {
    setTimeout(async () => {
        const distributor = await Distributor.getInstance(providerURL)
        await distributor.distribute(minSleep, maxSleep, pkTestWallet, Number(amountOfBaseCurrencyToKeepInEachWallet))
    }, 360)
}