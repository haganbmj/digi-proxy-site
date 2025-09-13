import { mount } from '@vue/test-utils';
import ProxyPage from './ProxyPage.vue';
import { describe, expect, test, beforeAll } from 'vitest';

const wrapper = mount(ProxyPage, {
    mocks: {
        $t: () => {},
    },
});

beforeAll(async () => {
    // Wait for the Async mounted functions to run and initialize the card dataset.
    while(Object.keys(wrapper.getCurrentComponent().data.sets).length === 0) {
        await new Promise(r => setTimeout(r, 50));
    }
}, 10000);

describe('Core Rendering', async () => {
    test('Renders', () => {
        expect(wrapper.find('#deck-input').exists()).toBe(true);
    });
});

describe('Deck Loading', async () => {
    await wrapper.find('#deck-input').setValue('4 Agumon');
    await wrapper.find('#submit-decklist').trigger('click');

    test('Properties', () => {
        const cards = wrapper.getCurrentComponent().data.cards;
        // console.log(JSON.stringify(cards[0]));
        expect(cards.length).toBe(1);
        expect(cards[0].quantity).toBe(4);
        expect(cards[0].name).toBe('agumon');
    });

    test('Has Card Entry', () => {
        expect(wrapper.findAll('.card-select').length).toBe(1);
    })
});
