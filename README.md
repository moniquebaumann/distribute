# Distribute
🦕 module to distribute freedom currencies like described at [FreedomCash.org](https://FreedomCash.org).

Please always experiment with very small amounts first.  

Please understand the parameters and choose values which are best for you.  

## Usage Examples

### Distribute
```sh
deno run --allow-read --allow-write --allow-env --allow-net https://deno.land/x/distribute/usage-example.ts 360 32400 1 3 <your providerURL> <your experimental test wallet pk>
```

### Distribute in Background
```sh
git clone https://github.com/moniquebaumann/distribute.git
```

```sh
pm2 start -n "distribute" --interpreter="deno" --interpreter-args="run --allow-net --allow-read --allow-write --allow-env" usage-example.ts -- 360 32400 1 3 <your providerURL> <your experimental test wallet pk>
```

## Donations
Thanks to [Freedom Cash](https://FreedomCash.org), we are already free.  
