import { describe, expect, test } from 'vitest';
import { normalizeCardName } from './CardNames.mjs';

describe('normalizeCardNames()', () => {
    describe('Case Insensitive', () => {
        [
            { input: `Agumon`, expected: `agumon` },
            { input: `MegaSeadramon`, expected: `megaseadramon` },
        ].map((t) => {
            test(t.input, () => {
                expect(normalizeCardName(t.input)).toBe(t.expected);
            });
        });
    });

    describe('Whitespace', () => {
        [
            { input: `  Deep  \t Savers   `, expected: `deep savers` },
        ].map((t) => {
            test(t.input, () => {
                expect(normalizeCardName(t.input)).toBe(t.expected);
            });
        });
    });
});
