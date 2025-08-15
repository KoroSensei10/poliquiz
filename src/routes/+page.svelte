<script lang="ts">
    import { untrack } from "svelte";
    import { Ordering } from "../types/ordering";
    import { userGuessCommand } from "./guess.remote";

    let { data } = $props();

    let userGuess: string | null = $state(null);
    let mainInput: HTMLInputElement | null = $state(null);
    let submitTime: number | null = $state(null); // reactive value of "when" the user press enter

    let serverResponse: number | string | null = $state(null);
    let win = $derived(serverResponse === Ordering.EQUAL);
    let serverResponseFormatted: string = $derived.by(() => {
        if (typeof serverResponse === "string") {
            return serverResponse;
        }
        if (serverResponse === Ordering.EQUAL) return "GG!";
        if (serverResponse === Ordering.LESS) return "Too low";
        if (serverResponse === Ordering.GREATER) return "Too high";
        return "";
    });

    async function submit(e: SubmitEvent) {
        e.preventDefault();
        submitTime = Date.now();
        if (!userGuess) return; // TODO: add feeback
        try {
            serverResponse = await userGuessCommand({
                targetId: data.randomId,
                userInput: userGuess,
            });
        } catch (e) {
            serverResponse = "whoopsie 500"
            console.log(e);
        }
    }

    $effect(() => {
        if (submitTime && win) {
            untrack(() => {
                userGuess = null;
            });
            mainInput?.blur();
        } else {
            mainInput?.select();
        }
    });
</script>

{#key submitTime}
    <div class="z-30 uniqPulse fixed w-full h-full border border-white/20 rounded-2xl pointer-events-none">
    </div>
{/key}

<div
    class="overflow-hidden transition-colors duration-100 relative w-screen h-screen flex flex-col items-center justify-center
    text-white
    {win ? 'bg-green-800' : 'bg-gray-900'}"
>
    <span
        class="absolute z-0 text-[20rem] -rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            {win ? "text-white" : 'text-red-500'}
        "
    >
        {serverResponseFormatted}
    </span>
    <div
        class="relative z-10 w-60 h-80 grid grid-rows-[1fr_4rem] items-center
            rounded-2xl shadow-xl overflow-hidden
            {win ? 'not-focus-within:bg-transparent not-focus-within:text-green-800 backdrop-blur-xs' : ''}
            {submitTime && !win ? 'focus-within:bg-transparent bg-gray-700 backdrop-blur-md' : ''}
            transition-all duration-100
            bg-green-900
        "
    >
        <!-- {#key userGuess}
            <div class=" uniqPulse opacity-0 absolute bottom-0 right-0 w-full border-b border-white/40">
            </div>
        {/key} -->
        {#key submitTime}
            <div class=" uniqPulse opacity-0 absolute bottom-0 right-0 w-full border-b border-white">
            </div>
        {/key}
        <div
            class="row-span-1 w-full flex justify-center items-center overflow-hidden
                {win ? '' : ''}
            "
        >
            <span
                class="text-[16rem] rotate-6
                {win ? '' : ''}
            ">{data.randomId}</span
            >
        </div>
        <form
            action=""
            onsubmit={submit}
            class=" z-20 row-span-1 bg-black/10 h-full flex justify-center items-center"
        >
            <label
                class="flex text-center placeholder:text-center justify-center items-center"
            >
                <input
                    bind:this={mainInput}
                    bind:value={userGuess}
                    min="0"
                    max="99"
                    placeholder="Your guess"
                    class="appearance-none active:outline-none focus:outline-none"
                />
            </label>
        </form>
    </div>
</div>

<style>
    @keyframes fadeOut {
        0% { opacity: 80%; }
        10% { opacity: 100%;}
        100% { opacity: 0% }
    }

    .uniqPulse {
        opacity: 0%;
        animation: .3s fadeOut ease-out;
    }
</style>