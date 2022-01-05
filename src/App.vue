<script setup>
import { ref, unref, computed } from "@vue/reactivity";
import * as ethers from "ethers";
import { onMounted } from "@vue/runtime-core";
const provider =
    window.ethereum &&
    new ethers.providers.Web3Provider(window.ethereum, "any");
const connected = ref(false);
const userAccount = ref(null);
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
    <div class="flex items-center justify-center h-screen text-left">
        <div class="w-96 mx-auto">
            <img class="w-full mb-9" src="https://picsum.photos/350/150" />
            <h1 class="text-2xl text-pink-600 font-bold mb-4">24 px doodles</h1>
            <p class="text-sm mb-6">
                <a class="underline" href="https://opensea.io" target="_blank" rel="noreferrer">OpenSea</a>
                ∙
                <a class="underline" href="https://etherscan.io" target="_blank" rel="noreferrer">EtherScan</a>
                ∙
                <a class="underline" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                ∙
                <a class="underline" href="https://discord.gg" target="_blank" rel="noreferrer">Discord</a>
            </p>
            <p class="mb-6 text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <p class="mb-3 text-sm font-bold">
                <button class="px-4 py-2 bg-pink-600 hover:bg-pink-400 text-rose-100 hover:text-black" @click="connect" v-if="!connected">Connect</button>
                <span>{{styledAccount}}</span>
            </p>
        </div>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
