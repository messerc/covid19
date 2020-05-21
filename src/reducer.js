import { atom, selector } from 'recoil';

export const caseState = atom({
    key: 'cases',
    default: [],
});

export const deathState = atom({
    key: 'deaths',
    default: [],
});

export const recoveredState = atom({
    key: 'recovered',
    default: [],
});

const composeCountByDate = (data) => {
    const countsByDate = {};
    data.forEach((place) => {
        Object.entries(place).forEach(([key, value]) => {
            // we have a date
            if (!isNaN(Date.parse(key))) {
                // add to the number or initialize it
                if (countsByDate[key]) {
                    countsByDate[key] = Number(countsByDate[key]) + Number(value);
                } else {
                    countsByDate[key] = Number(value);
                }
            }
        });
    });
    return countsByDate;
}

export const casesAndRecoveredState = selector({
    key: 'casesPerDay',
    get: ({ get }) => {
        const casesByDate = composeCountByDate(get(caseState));
        const recoveredByDate = composeCountByDate(get(recoveredState));
        return Object.entries(casesByDate).map(([key, value]) => {
            return {
                date: key,
                reported: value,
                recovered: recoveredByDate[key],
            };
        });
    }
})
