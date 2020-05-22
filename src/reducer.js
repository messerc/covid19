import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { atom, selector } from 'recoil';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore)

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
        // just always filter by date - laziness here
        datasets = datasets.map((dataset) => {
            return dataset.map((place) => {
                const validKeys = Object.keys(place)
                    .filter((key) => {
                        // if parsing a date object entry, see if it fits our range
                        if (!isNaN(Date.parse(key)) && dayjs(key).isSameOrAfter(date.start) && dayjs(key).isSameOrBefore(date.end)) {
                            return true;
                        } else if (!isNaN(Date.parse(key))) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                return validKeys.reduce((acc, key) => {
                    acc[key] = place[key];
                    return acc;
                }, {})
            })
        })

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
