import z from "zod";
import { command } from "$app/server";


import { Ordering } from "../types/ordering";

const schema = z.object({
    userInput: z.number(),
    targetId: z.number()
})

export const userGuessCommand = command(schema, async ({userInput, targetId}) => {
    // get the actual number of targetId's
    // compare the real value with the guess
    const realValue = 99 - targetId;
    if (realValue === userInput) return Ordering.EQUAL;
    if (userInput < realValue) return Ordering.LESS;
    if (userInput > realValue) return Ordering.GREATER;

    throw "Unreachable";
})