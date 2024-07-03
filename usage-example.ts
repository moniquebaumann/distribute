import { Distributor } from "./Distributor.ts"

const minSleep = Deno.args[0]
const maxSleep = Deno.args[1]
const minAmount = Deno.args[2]
const maxAmount = Deno.args[3]
const providerURL = Deno.args[4]
const pkTestWallet = Deno.args[5]
const amountOfBaseCurrencyToKeepInEachWallet = Deno.args[6]

console.log(amountOfBaseCurrencyToKeepInEachWallet)
if (minSleep == undefined || maxSleep == undefined || minSleep < 9) {
    throw new Error(`you might consider sleeping when the time is right`)
} else if (minAmount == undefined || maxAmount == undefined || amountOfBaseCurrencyToKeepInEachWallet == undefined || minAmount < 1 || maxAmount > 9000000000000000000) {
    throw new Error(`you might consider experimenting with specific small amounts`)
} else if (providerURL === undefined || pkTestWallet === undefined) {
    throw new Error("configuration parameter missing")
} else {
    setTimeout(async () => {
        const distributor = await Distributor.getInstance(providerURL)
        await distributor.distribute(minSleep, maxSleep, minAmount, maxAmount, pkTestWallet, Number(amountOfBaseCurrencyToKeepInEachWallet))
    }, 360)
}