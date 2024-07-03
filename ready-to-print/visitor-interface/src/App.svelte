<script>
	import { ethers } from "ethers";
	import QRCode from "qrcode";
	import { onMount } from "svelte";
	import { getTexts } from "./helpers.js";

	let walletInfos = [];
	let seedsString = "";
	let amountOfWallets = 9;
	let counter = 0;
	let generationCompleted = false;
	let resultOfCreateRandom;
	let walletFromPrivateKey;
	let texts = {};
	let ready = false;
	let showQRCodesAlso = false;

	onMount(async () => {
		texts = getTexts();
		ready = true;
	});

	function prepareOne(seed) {
		let walletInfo = {};
		console.log(`creating a wallet from phrase: ${seed}`)
		const resultOfCreateRandom = ethers.Wallet.fromPhrase(seed);
		console.log(`wtf`)
		// this.logger.warning(checker)
		walletInfo.address = resultOfCreateRandom.address;
		walletInfo.privateKey = resultOfCreateRandom.privateKey;
		walletInfo.mnemonic = resultOfCreateRandom.mnemonic.phrase;
		walletInfo.canvasIDAddress = `canvasAddress${counter}`;
		walletInfo.canvasIDPrivateKey = "canvasPrivateKey" + counter;

		return walletInfo;
	}

	function prepareQRCodes(data) {
		for (const walletInfo of data) {
			QRCode.toCanvas(
				document.getElementById(walletInfo.canvasIDAddress),
				walletInfo.address,
				{ errorCorrectionLevel: "M", version: 4 },
				function (error) {
					if (error) console.error(error);
					console.log("qr code addresssuccess!");
				},
			);
			QRCode.toCanvas(
				document.getElementById(walletInfo.canvasIDPrivateKey),
				walletInfo.privateKey,
				{ errorCorrectionLevel: "M", version: 5 },
				function (error) {
					if (error) console.error(error);
					console.log("qr code private key success!");
				},
			);
		}
	}
	async function generateAll() {
		const seeds = seedsString.split(",");
		amountOfWallets = seeds.length
		for (const seed of seeds) {
			counter++;
			let walletInfo = await prepareOne(seed.trim());
			walletInfos.push(walletInfo);
		}
		generationCompleted = true;

		if (showQRCodesAlso) {
			setTimeout(() => {
				prepareQRCodes(walletInfos);
			}, 1 * 200);
		}
	}
</script>

<main>
	{#if ready}
		{#if !generationCompleted}
			<div class="noprint">
				<h3>Paperwallet Generator</h3>

				<p />
				<div class="center">
					<label class="checkerContainer">
						<input type="checkbox" bind:value={showQRCodesAlso} />
						<!-- <span class="checkmark"></span> -->
						{texts.includingQRCodes}
					</label>
					<br />
					<textarea bind:value={seedsString} name="seeds" id=""></textarea>
					<p><br></p>
					<button on:click={generateAll}>{texts.generate}</button>
				</div>
			</div>
		{/if}

		<div class="center">
			{#if generationCompleted}
				{#each walletInfos as wi, index}
					<div
						class={(showQRCodesAlso && index % 2 === 0) || (!showQRCodesAlso && index % 9 === 0) && index > 1
							? "pageBreak"
							: "relax"}
					>
						<a href="https://FreedomCash.org" target="_blank">
							<h4>Geo-Caching.org</h4>
						</a>
						<div class="small">
							<!-- {texts.congrats} -->
							<p></p>
							<b> FreedomCash.org Wallet Address (Share): </b>
							{wi.address} <br />
							{#if showQRCodesAlso}
								<canvas id={wi.canvasIDAddress} />
							{/if}
							<p></p>
							<b> Private Key (do not share): </b>
							{wi.privateKey} <br />
							<p></p>
							<b> Mnemonic Phrase (do not share): </b>
							{wi.mnemonic} <br />

							{#if showQRCodesAlso}
								<canvas id={wi.canvasIDPrivateKey} />
							{/if}

						</div>
					</div>
				{/each}
			{/if}
			<div class="noprint">
				{#if walletInfos.length === amountOfWallets}
					<div class="noprint">
						<p></p>
						<button class="b1" onclick="window.print()"
							>{texts.print}</button
						>
						<p />
						<button class="b1" onclick="window.location.reload()"
							>{texts.reload}</button
						>
					</div>

					<p><br /></p>
					Generated public wallet addresses:
					<p />
					{#each walletInfos as wiForList}
						{wiForList.address} <br />
					{/each}
				{/if}
				<p><br /></p>
			</div>
		</div>
	{/if}
</main>

<style>
	main {
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		padding: 0em;
	}

	h3 {
		color: rgb(1, 111, 1);
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	.small {
		margin-left: 0;
		padding-left: 0;
		font-size: 9px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	@media print {
		.noprint {
			display: none;
		}

		.pageBreak {
			page-break-before: always;
		}
	}
</style>
