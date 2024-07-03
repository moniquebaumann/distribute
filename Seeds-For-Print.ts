import { Logger, sleepRandomAmountOfSeconds, ethers, FreedomSwaps, freiheitsABI } from "./deps.ts"
import { getLogger, getProvider, getContract, Freiheit, Friede, Geld, Matic } from "./helper.ts"

export class SeedsForPrint {

    public static instance

    public static async getInstance(providerURL: string): Promise<SeedsForPrint> {
        if (SeedsForPrint.instance === undefined) {
            const logger = await getLogger()
            const provider = getProvider(logger, providerURL)
            SeedsForPrint.instance = new SeedsForPrint(logger, provider, providerURL)
        }
        return SeedsForPrint.instance
    }

    private logger: Logger
    private provider: any
    private providerURL: string


    protected constructor(logger: Logger, provider: any, providerURL: string) {
        this.logger = logger
        this.provider = provider
        this.providerURL = providerURL
    }

    public async getSeedsForPrint(tokenIn: string, pkTestWallet: string) {
        let generatedWallets = JSON.parse(await Deno.readTextFileSync("./generatedWallets.txt"))

        let counter = 0
        for (const generatedWallet of generatedWallets) {
            counter++ 
            if (counter === generatedWallets.length) {
                this.logger.info(`${generatedWallet.mnemonic}`)
            }else {
                this.logger.info(`${generatedWallet.mnemonic},`)
            }
        }
    }
}

const providerURL = Deno.args[0]
const pkTestWallet = Deno.args[1]
const tokenIn = Deno.args[2]
const seedsForPrint = await SeedsForPrint.getInstance(providerURL)
await seedsForPrint.getSeedsForPrint(tokenIn, pkTestWallet)
