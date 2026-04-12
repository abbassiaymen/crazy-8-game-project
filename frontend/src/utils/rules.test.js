import { describe, it, expect } from 'vitest';
import { isValidMove } from '../utils/rules';

describe('isValidMove', () => {
    it('valid when suit matches', () => {
        expect(isValidMove({ suit: 'hearts', rank: 5 }, { suit: 'hearts', rank: 9 })).toBe(true);
    });

    it('valid when rank matches', () => {
        expect(isValidMove({ suit: 'clubs', rank: 9 }, { suit: 'hearts', rank: 9 })).toBe(true);
    });

    it('valid when card is 8 (wildcard)', () => {
        expect(isValidMove({ suit: 'spades', rank: 8 }, { suit: 'hearts', rank: 9 })).toBe(true);
    });

    it('invalid when neither suit nor rank matches', () => {
        expect(isValidMove({ suit: 'spades', rank: 7 }, { suit: 'hearts', rank: 9 })).toBe(false);
    });
});
