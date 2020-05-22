import { atom, selector } from 'recoil';

// data sets
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

// filters

export const dateState = atom({
    key: 'date',
    default: {
        start: null,
        end: null,
    },
});

export const countryState = atom({
    key: 'country',
    default: null
})

export const provinceState = atom({
    key: 'province',
    default: null
});


const filteredStates = selector({
    key: 'filteredStates',
    get: ({ get }) => {

        // filters
        const [country, province, date] = [
            get(countryState),
            get(provinceState),
            get(dateState),
        ];

        // data sets
        let datasets = [
            get(caseState),
            get(deathState),
            get(recoveredState),
        ];
        if (country) {
            datasets = datasets.map(dataset => {
                return dataset.filter(place => place['Country/Region'] === country)
            })
        }
        if (province) {
            datasets = datasets.map(dataset => {
                return dataset.filter(place => place['Province/State'] === province)
            })
        }
        return {
            cases: datasets[0],
            deaths: datasets[1],
            recovered: datasets[2],
        }
    }
})

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

export const casesAndRecoveredValue = selector({
    key: 'casesPerDay',
    get: ({ get }) => {
        const { cases, recovered } = get(filteredStates);
        console.log(cases);
        const casesByDate = composeCountByDate(cases);
        const recoveredByDate = composeCountByDate(recovered);
        return Object.entries(casesByDate).map(([key, value]) => {
            return {
                date: key,
                reported: value,
                recovered: recoveredByDate[key],
            };
        });
    }
});

export const deathsValue = selector({
    key: 'deathsPerDay',
    get: ({ get }) => {
        const { deaths } = get(filteredStates);
        const deathsByDate = composeCountByDate(deaths);
        return Object.entries(deathsByDate).map(([key, value]) => {
            return {
                date: key,
                deaths: value,
            };
        });
    }
});
