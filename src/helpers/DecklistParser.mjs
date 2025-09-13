import { normalizeCardName } from "./CardNames.mjs";

export function parseDecklist(decklist) {
    const response = {
        lines: [],
        errors: [],
    };

    for (let line of decklist.split("\n")) {
        line = line.trim();

        // Different sites have different sideboard formats.
        // Look for the word "sideboard" or lines that start with a double slash and skip them.
        // CubeCobra uses # to represent a comment line.
        // MTGA uses Sideboard and Deck as section headers.
        if (
            /^Sideboard:?$/i.test(line) ||
            /^Deck:?$/i.test(line) ||
            /^\/\//.test(line) ||
            /^#/.test(line) ||
            line === ""
        ) {
            continue;
        }

        // Extract the quantity and card name.
        // Using digimoncard.io as the reference for deck lists.
        const extract =
            /^(?:(\d+)?x?\s)?(.+?)\s*(?:\s+(\w+)-(\d+))?$/i.exec(line);

        // console.log(extract);

        if (extract === null) {
            response.errors.push(line);
            console.warn(`Failed to parse line: ${line}`);
            continue;
        }

        let [
            ,
            quantity,
            inputCardName,
            setName = undefined,
            collectorsNumber = undefined,
        ] = extract;

        if (quantity === undefined) {
            quantity = 1;
        }

        // parseInt should be safe here since it's a digit extraction,
        // decimal numbers will just get roped into the cardName and fail.
        if (parseInt(quantity) <= 0) {
            continue;
        }

        response.lines.push({
            name: normalizeCardName(inputCardName),
            quantity: parseInt(quantity),
            ...(setName ? { set: setName.toLocaleLowerCase() } : {}),
            ...(collectorsNumber ? { collectorsNumber } : {}),
        });
    }

    return response;
}
