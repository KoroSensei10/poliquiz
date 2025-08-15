export function load({ _params }) {
    const randomId = Math.floor(Math.random() * 100);

    return {
        randomId: randomId
    };
}