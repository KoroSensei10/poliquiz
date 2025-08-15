<script lang="ts">
    import { Ordering } from '../types/ordering';
    import { userGuessCommand } from './guess.remote';

    let {
        data
    } = $props();

    let userGuess: number | null = $state(0);
    let response: string | null = $state(null);
    
</script>

<div>
    <span>
        Random id: {data.randomId} (response is {99 - data.randomId})
    </span>
    <form action="" onsubmit={async (e) => {
        e.preventDefault();
        if (!userGuess) return; // add feeback
        try {
                const res = await userGuessCommand({targetId: data.randomId, userInput: userGuess});
                if (res === Ordering.EQUAL) response = "GG!";
                if (res === Ordering.LESS) response = "Too low !"
                if (res === Ordering.GREATER) response = "Too high !"
            } catch (e) {
                response = "there is a woopsie on the server"
                console.log(e);
                
            }
        }}>
        <input bind:value={userGuess} type="number" min="0" max="99" placeholder="Your guess" />
    </form>
    <span class="border">
        {response}
    </span>
</div>