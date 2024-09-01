import { Logger, sleepRandomAmountOfSeconds, ethers, FreedomSwaps, KlassiToni } from "./deps.ts"
import { getLogger, getProvider, getContract, Freiheit, Friede, Geld, Matic, itsAKindOfMagic } from "./helper.ts"
import { geoCashABI } from "./abis/geo-cash-abi.ts"

export class Distributor {

    public static instance

    public static async getInstance(providerURL: string): Promise<Distributor> {
        if (Distributor.instance === undefined) {
            const logger = await getLogger()
            const provider = getProvider(logger, providerURL)
            Distributor.instance = new Distributor(logger, provider, providerURL)
        }
        return Distributor.instance
    }

    private logger: Logger
    private provider: any
    private lightSpeed: any
    private providerURL: string
    private readonly poolFee = 10000
    private readonly slippage = 1
    private assetRocks = true


    protected constructor(logger: Logger, provider: any, providerURL: string) {
        this.logger = logger
        this.provider = provider
        this.providerURL = providerURL
    }

    public async distribute(minSleep: number, maxSleep: number, pkTestWallet: string, keep: number) {
        while (this.assetRocks) {
            try {

                let maticSender = await this.prepareTxInitiator(pkTestWallet)
                await this.updateSenderHistory(maticSender)

                let newWallet = await this.generateNewWallet()
                await this.saveNewWalletInfo(newWallet)

                await this.sendMaticToNewWallet(maticSender.address, [newWallet.address], maticSender.privateKey, keep)

                const swapper = await this.prepareTxInitiator()

                await this.buyAssetsWithNewWallet(swapper)

            } catch (error) {
                this.logger.error(error.message)
                await sleepRandomAmountOfSeconds(32400, 291600)
            }
            await sleepRandomAmountOfSeconds(minSleep, maxSleep)
        }
    }

    private async updateSenderHistory(newSender: any) {
        let senderHistory = JSON.parse(await Deno.readTextFileSync("./senderHistory.txt"))
        this.logger.info(`there are ${senderHistory.length} entries in senderHistory.txt`)
        senderHistory.push(newSender)
        await Deno.writeTextFile("./senderHistory.txt", JSON.stringify(senderHistory));

    }
    private async prepareTxInitiator(pkTestWalletInitial?: string) {
        let generatedWallets = JSON.parse(await Deno.readTextFileSync("./generatedWallets.txt"))
        this.logger.info(`there are ${generatedWallets.length} entries in generatedWallets.txt`)
        let pkTestWallet
        if (generatedWallets.length === 0) {
            pkTestWallet = pkTestWalletInitial
        } else {
            pkTestWallet = generatedWallets[generatedWallets.length - 1].privateKey
        }
        const wallet = new ethers.Wallet(pkTestWallet, this.provider)
        const signer = await wallet.connect(this.provider)
        const txInitiator = { address: await signer.getAddress(), privateKey: pkTestWallet }
        // this.logger.debug(`Transaction Initiator: ${txInitiator}`)

        return txInitiator
    }

    private generateNewWallet() {
        let walletInfo: any = {};
        const resultOfCreateRandom = ethers.Wallet.createRandom();
        const checker = ethers.Wallet.fromPhrase(resultOfCreateRandom.mnemonic.phrase);
        walletInfo.address = resultOfCreateRandom.address;
        walletInfo.privateKey = resultOfCreateRandom.privateKey;
        walletInfo.mnemonic = resultOfCreateRandom.mnemonic.phrase;

        if (walletInfo.address !== checker.address) throw new Error("what")
        if (walletInfo.privateKey !== checker.privateKey) throw new Error("the")
        if (walletInfo.mnemonic !== checker.mnemonic.phrase) throw new Error("fuck")
        return walletInfo;
    }

    private async saveNewWalletInfo(newWallet: any) {
        let happyWallets = JSON.parse(await Deno.readTextFileSync("./generatedWallets.txt"))
        happyWallets.push(newWallet)
        await Deno.writeTextFile("./generatedWallets.txt", JSON.stringify(happyWallets));
    }

    private async sendMaticToNewWallet(sender: string, receivers: any[], pkTestWallet: string, keep: number) {
        const maticBalanceOfSender = await this.provider.getBalance(sender)

        this.logger.info(`the maticBalance of the sender ${sender} before sending is ${ethers.formatEther(maticBalanceOfSender)}`)

        const maticAmountForNextWallet = maticBalanceOfSender - BigInt(keep * 10 ** 18) // so that people can celebrate some first successful transactions
        const geldC = await getContract(Geld, geoCashABI, this.provider, pkTestWallet)

        const tx = await geldC.distributeMatic(maticAmountForNextWallet, receivers, { value: BigInt(receivers.length) * maticAmountForNextWallet })
        this.logger.debug(`send matic tx: https://polygonscan.com/tx/${tx.hash}`)
        await tx.wait()
    }

    private async buyAssetsWithNewWallet(txInitiator: any) {

        await sleepRandomAmountOfSeconds(360, 3600) // to be sure the matic is there with enough block confirmations
        const maticBalanceBeforeSwaps = await this.provider.getBalance(txInitiator.address)

        this.logger.info(`the maticBalance of the swap initiator ${txInitiator.address} before swaps is ${ethers.formatEther(maticBalanceBeforeSwaps)}`)

        // const amountIn = BigInt(1618033988749894903)
        const amountIn = BigInt((itsAKindOfMagic() * 10 ** 18).toFixed(0))
        const freedomSwaps = await FreedomSwaps.getInstance(this.providerURL)
        // try {
        //     await freedomSwaps.swap(Matic, Freiheit, amountIn, this.poolFee, this.slippage, txInitiator.privateKey)
        // } catch (error) {
        //     this.logger.error(`the following error happened while buying Freiheit: ${error.message}`)
        // }
        // await sleepRandomAmountOfSeconds(3, 9)
        // try {
        //     await freedomSwaps.swap(Matic, Friede, amountIn, this.poolFee, this.slippage, txInitiator.privateKey)
        // } catch (error) {
        //     this.logger.error(`the following error happened while buying Friede: ${error.message}`)
        // }
        // await sleepRandomAmountOfSeconds(3, 9)
        // try {
        //     await freedomSwaps.swap(Matic, Geld, BigInt(Number(amountIn)), this.poolFee, this.slippage, txInitiator.privateKey)
        // } catch (error) {
        //     this.logger.error(`the following error happened while buying Geo Cash: ${error.message}`)
        // }
        // await sleepRandomAmountOfSeconds(3, 9)
        // try {
        //     const Spass = "0x33b5624f20b41e2bc6d71fd039e3bd05524c1d82"
        //     if (this.lightSpeed === undefined) {
        //         const klassiToni = await KlassiToni.getInstance(this.providerURL, txInitiator.privateKey, Spass)
        //         this.lightSpeed = await klassiToni.getLightSpeedInMetersPerSecond()
        //     }
        //     await freedomSwaps.swap(Matic, Spass, this.lightSpeed * BigInt(10 ** 9), this.poolFee, this.slippage, txInitiator.privateKey)
        // } catch (error) {
        //     this.logger.error(`the following error happened while buying Spass: ${error.message}`)
        // }
        // await sleepRandomAmountOfSeconds(3, 9)
        // try {
        //     const Reality = "0xf0d0de34d35fb646ea6a4d3e92b629e92654d2c5"
        //     if (this.lightSpeed === undefined) {
        //         const klassiToni = await KlassiToni.getInstance(this.providerURL, txInitiator.privateKey, Reality)
        //         this.lightSpeed = await klassiToni.getLightSpeedInMetersPerSecond()
        //     }
        //     await freedomSwaps.swap(Matic, Reality, this.lightSpeed * BigInt(10 ** 9), this.poolFee, this.slippage, txInitiator.privateKey)
        // } catch (error) {
        //     this.logger.error(`the following error happened while buying REAL: ${error.message}`)
        // }
        try {
            const Schweizer = "0xdbc5a5b3e6cb3cbcdb4b62c1a4c182d08da3e4f2"
            if (this.lightSpeed === undefined) {
                const klassiToni = await KlassiToni.getInstance(this.providerURL, txInitiator.privateKey, Schweizer)
                this.lightSpeed = await klassiToni.getLightSpeedInMetersPerSecond()
            }
            const poolFee = 3000
            await freedomSwaps.swap(Matic, Schweizer, this.lightSpeed * BigInt(10 ** 9), poolFee, this.slippage, txInitiator.privateKey)
        } catch (error) {
            this.logger.error(`the following error happened while buying Schweizer: ${error.message}`)
        }
        const maticBalanceAfterSwaps = await this.provider.getBalance(txInitiator.address)
        this.logger.info(`the maticBalance of the swap initiator ${txInitiator.address} after the swaps is ${ethers.formatEther(maticBalanceAfterSwaps)}`)
    }
}