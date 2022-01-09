<script setup>
import OpenSea from "./components/OpenSea.vue";
import { ref, unref, computed } from "@vue/reactivity";
import * as ethers from "ethers";
import { onMounted } from "@vue/runtime-core";
const provider =
    window.ethereum &&
    new ethers.providers.Web3Provider(window.ethereum, "any");
const connected = ref(false);
const userAccount = ref(null);
const amount = ref(1);
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
        // contract = contract.connect(provider.getSigner());
    } else {
        connected.value = false;
        userAccount.value = null;
        // contract = contract.connect(provider);
    }
};
onMounted(async () => {
    if (!provider) return null;
    await accountChanged();
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", accountChanged);
        // window.ethereum.on('chainChanged', networkChanged);
    }
});
</script>

<template>
    <div class="min-h-screen bg-bg">
        <img class="mx-auto w-auto h-80 rendering-crisp-edges" src="./assets/Unique.png" />
        <div class="flex items-center justify-center text-left mt-10">
            <div class="w-96 mx-auto">
                <h1 class="text-2xl text-pink-600 font-bold mb-4 uppercase">Catoodles</h1>
                <p class="mb-6 text-base">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
                <p class="gap-5 mb-6 flex flex-row justify-center">
                    <a href="https://twitter.com" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges" src="./assets/Twitter.png" />
                    </a>
                    <a href="https://discord.gg" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges" src="./assets/Discord.png" />
                    </a>
                    <a href="https://opensea.io/" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges" src="./assets/Opensea.png" />
                    </a>
                    <a href="https://etherscan.io/" target="_blank">
                        <img class="w-14 h-14 rendering-crisp-edges" src="./assets/Etherscan.png" />
                    </a>
                </p>
                <p class="mb-3 text-sm font-bold flex flex-row justify-center">
                    <img class="w-auto h-16 rendering-crisp-edges cursor-pointer" src="./assets/Connect.png" @click="connect" v-if="!connected" />
                    <span class="text-center" v-else>{{styledAccount}}</span>
                </p>
                <p class="mb-3 text-sm font-bold flex flex-col w-1/2 mx-auto" v-if="connected">
                    <img class="w-auto h-20 rendering-crisp-edges cursor-pointer" src="./assets/Mint.png" @click="mint" />
                    <input class="bg-bg" type="range" min="1" max="50" v-model.number="amount" />
                </p>
                <p class="text-sm font-bold text-center">
                    0 / 5000
                </p>
            </div>
        </div>
    </div>
</template>

<style>
#app {
    font-family: 'pixelmix', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
