import { Logger, sleepRandomAmountOfSeconds, ethers, FreedomSwaps } from "./deps.ts"
import { getLogger, getProvider, getContract, Freiheit, Friede, Geld, Matic } from "./helper.ts"

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
    private providerURL: string
    private readonly poolFee = 10000
    private readonly slippage = 30
    private assetRocks = true


    protected constructor(logger: Logger, provider: any, providerURL: string) {
        this.logger = logger
        this.provider = provider
        this.providerURL = providerURL
    }

    public async distribute(minSleep: number, maxSleep: number, minAmount: number, maxAmount: number, pkTestWallet: string) {
        while (this.assetRocks) {
            try {

                let maticSender = await this.prepareTxInitiator(pkTestWallet)
                await this.updateSenderHistory(maticSender)

                let newWallet = await this.generateNewWallet()
                await this.saveNewWalletInfo(newWallet)

                await this.sendMaticToNewWallet(maticSender.address, [newWallet.address], maticSender.privateKey)

                const swapper = await this.prepareTxInitiator()

                await this.buyAssetsWithNewWallet(minAmount, maxAmount, swapper)

            } catch (error) {
                this.logger.error(error.message)
                await sleepRandomAmountOfSeconds(32400, 291600)
            }
            await sleepRandomAmountOfSeconds(minSleep, maxSleep)
        }
    }

    private async updateSenderHistory(newSender: any) {
        let senderHistory = JSON.parse(await Deno.readTextFileSync("./senderHistory.txt"))
        senderHistory.push(newSender)
        await Deno.writeTextFile("./senderHistory.txt", JSON.stringify(senderHistory));

    }
    private async prepareTxInitiator(pkTestWalletInitial?: string) {
        let generatedWallets = JSON.parse(await Deno.readTextFileSync("./generatedWallets.txt"))
        this.logger.warning(generatedWallets.length)
        let pkTestWallet
        if (generatedWallets.length === 0) {
            pkTestWallet = pkTestWalletInitial
        } else {
            pkTestWallet = generatedWallets[generatedWallets.length - 1].privateKey
        }
        const wallet = new ethers.Wallet(pkTestWallet, this.provider)
        const signer = await wallet.connect(this.provider)
        const txInitiator = { address: await signer.getAddress(), privateKey: pkTestWallet }
        this.logger.info(`Transaction Initiator: ${txInitiator}`)

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
        this.logger.warning(happyWallets.length)
        await Deno.writeTextFile("./generatedWallets.txt", JSON.stringify(happyWallets));
    }

    private async sendMaticToNewWallet(sender: string, receivers: any[], pkTestWallet) {
        const maticBalanceOfSender = await this.provider.getBalance(sender)

        this.logger.info(`the maticBalance of ${sender} is ${maticBalanceOfSender}`)

        if (maticBalanceOfSender > BigInt(11 * 10 ** 18)) {
            throw new Error("really?")
        }

        const maticAmountForNextWallet = maticBalanceOfSender - BigInt(10 ** 18)
        const geldC = await getContract(Geld,
            this.provider,
            "./abis/geo-cash-abi.json",
            pkTestWallet)

        const tx = await geldC.distributeMatic(maticAmountForNextWallet, receivers, { value: BigInt(receivers.length) * maticAmountForNextWallet })
        this.logger.info(`send matic tx: https://polygonscan.com/tx/${tx.hash}`)
        await tx.wait()
    }

    private async buyAssetsWithNewWallet(minAmount: number, maxAmount: number, txInitiator: any) {

        await sleepRandomAmountOfSeconds(90, 180)
        const maticBalanceBeforeSwaps = await this.provider.getBalance(txInitiator.address)

        this.logger.info(`the maticBalance of ${txInitiator.address} before swaps is ${maticBalanceBeforeSwaps}`)

        if (maticBalanceBeforeSwaps < BigInt(maxAmount * 10 ** 18)) {
            throw new Error(`maticBalanceBeforeSwaps ${maticBalanceBeforeSwaps} is lower than ${maxAmount}`)
        }

        const amountIn = Math.round(Math.random() * (maxAmount - minAmount) + minAmount)
        const freedomSwaps = await FreedomSwaps.getInstance(this.providerURL)
        await freedomSwaps.swap(Matic, Freiheit, amountIn, this.poolFee, this.slippage, txInitiator.privateKey)
    }
}