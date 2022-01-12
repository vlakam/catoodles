<script setup>
import { abi, address, chain } from "./contract.js";
import { ref, unref, computed } from "@vue/reactivity";
import * as ethers from "ethers";
import { onMounted } from "@vue/runtime-core";
const provider =
    window.ethereum &&
    new ethers.providers.Web3Provider(window.ethereum, "any");

let contract = provider && new ethers.Contract(address, abi, provider);

const connected = ref(false);
const userAccount = ref(null);
const network = ref(null);
const amount = ref(1);
const maxAmount = ref(10);
const totalSupply = ref(0);
const disableButton = ref(false);

const updateSupply = async () => {
    if (!contract) return;
    try {
        totalSupply.value = (await contract.totalSupply()).toNumber();
        console.log(unref(totalSupply));
        if (userAccount.value) {
            const balance = (
                await contract.mintedNFTs(userAccount.value)
            ).toNumber();

            maxAmount.value = Math.min(10, 100 - balance);
        } else {
            maxAmount.value = 10;
        }
    } catch (e) {}
};

const mint = async () => {
    if (disableButton.value) return;
    if (!provider)
        return alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
    if (network.value !== chain) {
        return alert("Please change your network to Mainnet");
    }
    // if (!isSaleActive.value) {
    //     return alert("Sale is not active now");
    // }
    if (maxAmount.value === 0) {
        return alert("You have minted maximum amount for this wallet");
    }
    if (amount.value > maxAmount.value) {
        return alert(`Not able to mint above the limit: ${maxAmount.value}`);
    }

    disableButton.value = true;
    try {
        const mintPrice = await contract.mintPrice(amount.value);
        let gasLimit;
        try {
            gasLimit = await contract.estimateGas.mint(amount.value, {
                value: mintPrice,
            });
        } catch (e) {
            gasLimit = 250000;
            console.log(e);
        }
        const transaction = await contract.mint(amount.value, {
            value: mintPrice,
            gasLimit,
        });
        await transaction.wait();
        amount.value = 1;
    } catch (e) {
        alert(e.message || e);
    } finally {
        disableButton.value = false;
        updateSupply();
    }
};

const connect = async () => {
    if (!provider)
        return alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
    await provider.send("eth_requestAccounts", []);
};

const styledAccount = computed(() => {
    const account = unref(userAccount);
    return account
        ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
          )}`
        : null;
});
const accountChanged = async () => {
    if (!provider) return null;
    const accounts = await provider.listAccounts();
    console.log("Account:", accounts);
    if (accounts.length) {
        connected.value = true;
        userAccount.value = accounts[0];
        console.log(userAccount);
        contract = contract.connect(provider.getSigner());
    } else {
        connected.value = false;
        userAccount.value = null;
        contract = contract.connect(provider);
    }
};

const networkChanged = async () => {
    const { chainId } = await provider.getNetwork();
    network.value = chainId;
    console.log(chainId);
};

onMounted(async () => {
    if (!provider) return null;
    await accountChanged();
    await networkChanged();
    await updateSupply();
    setInterval(updateSupply, 10000);
    // setInterval(() => {
    //     currentDate.value = new Date();
    // }, 1000);
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", accountChanged);
        window.ethereum.on("chainChanged", networkChanged);
    }
});
</script>

<template>
    <div class="min-h-screen bg-bg">
        <img class="mx-auto w-auto h-80 rendering-crisp-edges" src="./assets/cat.png" />
        <div class="flex items-center justify-center text-center mt-10">
            <div class="w-[45rem] mx-auto">
                <h1 class="text-2xl text-kris-red mb-4 uppercase tracking-widest">Catoodles</h1>
                <p class="gap-5 mb-6 flex flex-row justify-center">
                    <a href="https://twitter.com" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges hover:opacity-75" src="./assets/Twitter.png" />
                    </a>
                    <a href="https://discord.gg" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges hover:opacity-75" src="./assets/Discord.png" />
                    </a>
                    <a href="https://opensea.io/" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges hover:opacity-75" src="./assets/Opensea.png" />
                    </a>
                    <a href="https://etherscan.io/" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges hover:opacity-75" src="./assets/Etherscan.png" />
                    </a>
                </p>
                <p class="mb-6 text-base text-justify px-2 lg:px-0">
                    5000 randomly generated Catoodles on the Ethereum blockchain. <br />
                    Fully on-chain. No roadmap, just nice Catoodles. <br />
                    First 2500 free, then 0.0069 <br />
                </p>
                <p class="mb-3 text-sm font-bold flex flex-row justify-center">
                    <img class="w-auto h-16 rendering-crisp-edges cursor-pointer" src="./assets/Connect.png" @click="connect" v-if="!connected" />
                    <!-- <span class="text-center" v-else>{{styledAccount}}</span> -->
                </p>
                <div class="mb-3 text-sm font-bold flex flex-col w-1/3 mx-auto items-center" v-if="connected">
                    <img class="w-full h-auto mx-auto rendering-crisp-edges cursor-pointer hover:opacity-75" :class="{'cursor-not-allowed opacity-50': disableButton}" src="./assets/Mint.png" @click="mint" />
                    <div class="flex flex-row justify-center items-center gap-4 px-5">
                        <input class="bg-bg" type="range" min="1" :max="maxAmount" v-model.number="amount" />
                        <span class="w-6 text-pinky-text">{{amount}}</span>
                    </div>
                </div>
                <p class="text-sm text-center">
                    {{totalSupply}} / 5000
                </p>
            </div>
        </div>
    </div>
</template>

<style>
#app {
    font-family: "pixelmix", Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
