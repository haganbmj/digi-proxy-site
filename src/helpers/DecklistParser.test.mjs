import { describe, expect, test } from "vitest";
import { parseDecklist } from "./DecklistParser.mjs";
const ScryfallDatasetAsync = () => import("../../data/cards-minimized.json");

describe("parseDecklist()", () => {
    describe("Quantities", () => {
        test("Unspecified", () => {
            expect(
                parseDecklist(
                    `
                    Agumon
                    `,
                ),
            ).toStrictEqual({
                lines: [{ name: "agumon", quantity: 1 }],
                errors: [],
            });
        });

        test("N abc", () => {
            expect(
                parseDecklist(
                    `
                    3 Agumon
                    `,
                ),
            ).toStrictEqual({
                lines: [{ name: "agumon", quantity: 3 }],
                errors: [],
            });
        });

        test("Nx abc", () => {
            expect(
                parseDecklist(
                    `
                    4x Agumon
                    `,
                ),
            ).toStrictEqual({
                lines: [{ name: "agumon", quantity: 4 }],
                errors: [],
            });
        });

        test("Double Digit", () => {
            expect(
                parseDecklist(
                    `
                    43 Agumon
                    `,
                ),
            ).toStrictEqual({
                lines: [{ name: "agumon", quantity: 43 }],
                errors: [],
            });
        });

        test("Zero", () => {
            expect(
                parseDecklist(
                    `
                    0 Agumon
                    `,
                ),
            ).toStrictEqual({
                lines: [],
                errors: [],
            });
        });

        test("Mixed", () => {
            expect(
                parseDecklist(
                    `
                    4 Kird Ape
                    39x Fireblast
                    1 +2 Mace
                    Ghor-Clan Rampager
                    0 Griselbrand
                    9 9 9 9 9
                    `,
                ),
            ).toStrictEqual({
                lines: [
                    { name: "kird ape", quantity: 4 },
                    { name: "fireblast", quantity: 39 },
                    { name: "+2 mace", quantity: 1 },
                    { name: "ghor-clan rampager", quantity: 1 },
                    { name: "9 9 9 9", quantity: 9 },
                ],
                errors: [],
            });
        });
    });

    describe("Ignored Lines", () => {
        test("Empty Lines", () => {
            expect(
                parseDecklist(
                    `

                    `,
                ),
            ).toStrictEqual({
                lines: [],
                errors: [],
            });
        });

        test("Deck Section Header", () => {
            expect(
                parseDecklist(
                    `
                    Deck
                    Deck:
                    1x Abandon Hope
                    The Deck of Many Things
                    Deck Deck Go ABC-123
                    `,
                ),
            ).toStrictEqual({
                lines: [
                    { name: "abandon hope", quantity: 1 },
                    { name: "the deck of many things", quantity: 1 },
                    {
                        name: "deck deck go",
                        collectorsNumber: "123",
                        quantity: 1,
                        set: "abc",
                    },
                ],
                errors: [],
            });
        });

        test("Commented Out Lines", () => {
            expect(
                parseDecklist(
                    `
                    // Comment
                    2x Abandon Hope
                    // Another comment
                    fire // ice
                    # comment
                    #comment
                    ## Comment
                    Experiment #9
                    `,
                ),
            ).toStrictEqual({
                lines: [
                    { name: "abandon hope", quantity: 2 },
                    { name: "fire // ice", quantity: 1 },
                    { name: "experiment #9", quantity: 1 },
                ],
                errors: [],
            });
        });
    });

    describe("Deck Formats", () => {
        test("DimonCard.io Format", () => {
            expect(
                parseDecklist(
                    `
                    // Digimon Deck List
                    4 Aegisdramon EX8-029
                    3 Blue Memory Boost! P-036
                    4 Crabmon

                    // Egg Deck
                    4 Bukamon BT7-002
                    `,
                ),
            ).toStrictEqual({
                lines: [
                    {
                        name: "aegisdramon",
                        quantity: 4,
                        set: "ex8",
                        collectorsNumber: "029",
                    },
                    {
                        name: "blue memory boost!",
                        quantity: 3,
                        set: "p",
                        collectorsNumber: "036"
                    },
                    {
                        name: `crabmon`,
                        quantity: 4,
                    },
                    {
                        name: "bukamon",
                        quantity: 4,
                        set: "bt7",
                        collectorsNumber: "002",
                    },
                ],
                errors: [],
            });
        });
    });
});
