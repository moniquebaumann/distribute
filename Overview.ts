import { Logger, sleepRandomAmountOfSeconds, ethers, FreedomSwaps, freiheitsABI } from "./deps.ts"
import { getLogger, getProvider, getContract, Freiheit, Friede, Geld, Matic } from "./helper.ts"

export class Overview {

    public static instance

    public static async getInstance(providerURL: string): Promise<Overview> {
        if (Overview.instance === undefined) {
            const logger = await getLogger()
            const provider = getProvider(logger, providerURL)
            Overview.instance = new Overview(logger, provider, providerURL)
        }
        return Overview.instance
    }

    private logger: Logger
    private provider: any
    private providerURL: string


    protected constructor(logger: Logger, provider: any, providerURL: string) {
        this.logger = logger
        this.provider = provider
        this.providerURL = providerURL
    }

    public async getOverview(tokenIn: string, pkTestWallet: string) {
        let generatedWallets = JSON.parse(await Deno.readTextFileSync("./generatedWallets.txt"))

        for (const generatedWallet of generatedWallets) {
            if (tokenIn === Matic) {
                const maticBalance = await this.provider.getBalance(generatedWallet.address)
                this.logger.debug(`generatedWallet: ${generatedWallet.address} has ${ethers.formatEther(maticBalance)} Matic`)
                if (maticBalance > BigInt(1 * 10 ** 18)) {
                    this.logger.info(`you might improve the cash flow with: ${generatedWallet.privateKey}`)
                } else if (maticBalance < BigInt(1 * 10 ** 16)) {
                    this.logger.debug(`generatedWallet: ${generatedWallet.address} shall have more matic ${ethers.formatEther(maticBalance)} Matic / ${generatedWallet.privateKey}`)
                }
            }

            const erc20Contract = await getContract(tokenIn, freiheitsABI, this.provider, pkTestWallet)
            const tokenBalance = await erc20Contract.balanceOf(generatedWallet.address)
            this.logger.debug(`generatedWallet: ${generatedWallet.address} has ${ethers.formatEther(tokenBalance)} wMatic`)
            if (tokenBalance > 0) {
                this.logger.info(`you might improve the cash flow with: ${generatedWallet.privateKey}`)
                const freedomSwaps = await FreedomSwaps.getInstance(providerURL)
                await freedomSwaps.unwrap(generatedWallet.privateKey)
            }
        }
    }
}

const providerURL = Deno.args[0]
const pkTestWallet = Deno.args[1]
const tokenIn = Deno.args[2]
const overview = await Overview.getInstance(providerURL)
await overview.getOverview(tokenIn, pkTestWallet)
