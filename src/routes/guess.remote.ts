import z from "zod";
import { command } from "$app/server";


import { Ordering } from "../types/ordering";

const schema = z.object({
    userInput: z.string(),
    targetId: z.number()
})

export const userGuessCommand = command(schema, async ({userInput, targetId}) => {
    const userGuessParsed = Number(userInput);
    if (typeof userGuessParsed !== "number" || isNaN(userGuessParsed)) {
        return "Wrong input"
    }
    // get the actual number of targetId's
    // compare the real value with the guess
    const realValue = 99 - targetId;
    if (realValue === userGuessParsed) return Ordering.EQUAL;
    if (userGuessParsed < realValue) return Ordering.LESS;
    if (userGuessParsed > realValue) return Ordering.GREATER;

    throw "Unreachable";
})