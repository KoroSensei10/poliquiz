<script lang="ts">
    import { getPosts } from "$lib/personnage.remote";


    let randomNumber = $state(Math.floor(Math.random() * 100) + 1);
    let userGuess = $state(0);

    function resetGame(): void {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        userGuess = 0;
    }

    function checkGuess(): void {
        if (userGuess === randomNumber) {
            alert("Congratulations! You guessed the correct number.");
        } else {
            alert("Sorry, try again!");
        }
    }

</script>

<div>
    <span>The random number is: <strong>{randomNumber}</strong></span>
</div>

<form onsubmit={checkGuess}>
    <input type="number" bind:value={userGuess} min="0" max="100">
    <button type="submit">Submit Guess</button>
    
</form>
<button onclick={resetGame}>Reset</button>

<svelte:boundary>
    {#snippet pending()}
        <p>Guess the number between 1 and 100!</p>
    {/snippet}
    {#snippet failed(error, reset)}
        <p>server error ?</p>
    {/snippet}
    <ul>
        {#each await getPosts() as post}
        <div>
            <h2>Titre: {post.title}</h2>
            <p>Slug: {post.slug}</p>
        </div>
        {/each}
    </ul>
</svelte:boundary>
