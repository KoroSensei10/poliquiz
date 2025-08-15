export function load({ params }) {
    const randomId = Math.floor(Math.random() * 100);

    return {
        randomId: randomId
    };
}