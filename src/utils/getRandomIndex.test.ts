import { getRandomIndex } from "./getRandomIndex";

describe('getRandomIndex', () => {
    test("returns a number within the array bounds", () => {

        const length = 1;
        for (let i = 0; i < 100; i++) {
            const index = getRandomIndex(length)

            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(length);
        };
    });

});