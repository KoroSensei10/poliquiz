<script lang="ts">
    import { untrack } from "svelte";
    import { Ordering } from "../types/ordering";
    import { userGuessCommand } from "./guess.remote";

    let { data } = $props();

    let userGuess: string | null = $state(null);
    let mainInput: HTMLInputElement | null = $state(null);

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
        if (!userGuess) return; // add feeback
        try {
            serverResponse = await userGuessCommand({
                targetId: data.randomId,
                userInput: userGuess,
            });
        } catch (e) {
            console.log(e);
        }
    }

    $effect(() => {
        if (serverResponse) {}; // empty block to trigger effect
        if (win) {
            untrack(() => {
                userGuess = null;
            });
            mainInput?.blur();
        } else {
            mainInput?.select();
        }
    })
</script>

<div
    class=" transition-colors duration-100 relative w-screen h-screen flex flex-col items-center justify-center bg-gray-900
    text-white
    {win ? 'bg-green-800' : ''}"
>
    <span
        class="absolute z-0 text-[20rem] -rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
        {serverResponseFormatted}
    </span>
    <div
        class="z-10 w-60 h-80 grid grid-rows-[1fr_4rem] items-center
            bg-green-900 rounded-2xl shadow overflow-hidden
            {win ? 'bg-transparent text-green-800' : ''}
        "
    >
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
