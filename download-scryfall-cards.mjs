import fs from 'fs';
import axios from 'axios';
import { strict as assert } from 'assert';
import { normalizeCardName } from './src/helpers/CardNames.mjs';

if (!fs.existsSync('./data/default-cards.json') || process.argv[2] == "--update") {
    console.log('Downloading fresh card data.');

    const dataResp = await axios({
        url: 'https://digimoncard.io/api-public/search.php',
        method: 'GET',
        params: {
            n: '',
            sort: 'name',
            series: 'Digimon Card Game',
            sortdirection: 'desc',
        },
        responseType: 'stream',
    });

    const write = fs.createWriteStream('./data/default-cards.json');
    dataResp.data.pipe(write);
    await new Promise((res, rej) => {
        write.on('finish', res);
        write.on('error', rej);
    });

    console.log('Finished piping results to file.');
} else {
    console.log('Using existing card data.');
}

const cards = JSON.parse(fs.readFileSync('./data/default-cards.json'));

const stripped = cards.map(card => {
    return {
        name: normalizeCardName(card.name),
        set: {
            name: card.set_name,
            code: card.id.split('-')[0],
        },
        setNumber: card.id.split('-')[1],
        imageUris: {
            front: `https://images.digimoncard.io/images/cards/${card.id}.jpg`,
        },
    };
});

// fs.writeFileSync('./out.json', JSON.stringify(stripped, null, 2));

const minimized = stripped.reduce((store, card) => {
    // And take that and tighten it down as much as possible.
    // Need to look into gzip more, it might be possible to leave full urls if they get properly compressed out.
    const name = card.name.toLowerCase();
    store.cards[name] = store.cards[name] || [];
    // store.cards[name].push({
    //     s: `${card.set.code}-${card.setNumber}`,

    //     // Scryfall puts a timestamp query param on these, which we don't need as it'll trigger a full regeneration each week.
    //     // GZip seems to be doing a good job of optimizing out all the duplicate cdn url prefixes, so I guess it's okay to not over optimize.
    //     f: card.imageUris.front?.replace(/\?.*/, ''),
    //     b: card.imageUris.back?.replace(/\?.*/, ''),
    // });

    store.cards[name].push({
        setCode: card.set.code.toLowerCase(),
        collectorNumber: card.setNumber,
        name: card.name,
        urlFront: card.imageUris.front?.replace(/\?.*/, ''),
        urlBack: card.imageUris.back?.replace(/\?.*/, ''),
    })

    // store.sets[card.set.code] = card.set.name;
    store.sets[card.set.code.toLowerCase()] = card.set.code;

    return store;
}, { cards: {}, sets: {} });

console.log(`Found ${Object.keys(minimized.cards).length} cards from ${Object.keys(minimized.sets).length} sets.`);

// Run some basic sanity tests.
// assert.equal(minimized.cards['abandon hope']?.length, 1);
// assert.equal(minimized.cards['abandon hope']?.[0].s, 'tmp|107');
// assert.match(minimized.cards['abandon hope']?.[0].f, /scryfall\.com.*\.jpg$/);

// assert.equal(minimized.cards['lightning dragon']?.length, 4);
// assert.equal(minimized.cards['lightning dragon']?.[0].s, 'pusg|202');
// assert.equal(minimized.cards['lightning dragon']?.[1].s, 'usg|202');
// assert.equal(minimized.cards['lightning dragon']?.[2].s, 'prm|32196');
// assert.equal(minimized.cards['lightning dragon']?.[3].s, 'vma|177');
// assert.equal(minimized.cards['lightning dragon']?.[0].d, undefined);
// assert.equal(minimized.cards['lightning dragon']?.[1].d, undefined);
// assert.equal(minimized.cards['lightning dragon']?.[2].d, 1);
// assert.equal(minimized.cards['lightning dragon']?.[3].d, 1);
// assert.equal(minimized.cards['lightning dragon']?.[0].p, 1);
// assert.equal(minimized.cards['lightning dragon']?.[1].p, undefined);
// assert.equal(minimized.cards['lightning dragon']?.[2].p, 1);
// assert.equal(minimized.cards['lightning dragon']?.[3].p, undefined);

// assert.equal(minimized.sets['tmp'], 'Tempest');

// assert(Object.keys(minimized.cards).length > 20000);
// assert(Object.keys(minimized.sets).length > 500);

// fs.writeFileSync('./min-pretty.json', JSON.stringify(minimized, null, 2));
fs.writeFileSync('./data/cards-minimized.json', JSON.stringify(minimized, null, 2));

console.log('Finished writing minimized card list.');
