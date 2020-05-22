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

const filterByCountry = (dataset, country) => dataset.filter(place => place['Country/Region'] === country);
const filterByProvince = (dataset, province) => dataset.filter(place => place['Province/State'] === province);
const filterByDate = (dataset, dates) => {
        return dataset.map((place) => {
            const validKeys = Object.keys(place)
                .filter((key) => {
                    // if parsing a date object entry, see if it fits our range
                    if (!isNaN(Date.parse(key)) && dayjs(key).isSameOrAfter(dates.start) && dayjs(key).isSameOrBefore(dates.end)) {
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
    }


const filteredStates = selector({
    key: 'filteredStates',
    get: ({ get }) => {

        // filters
        const [country, province, dates] = [
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
            datasets = datasets.map(dataset => filterByCountry(dataset, country));
        }

        if (province) {
            datasets = datasets.map(dataset => filterByProvince(dataset, province));
        }

        // just always filter by dates - laziness here and this is slow
        datasets = datasets.map(dataset => filterByDate(dataset, dates));

        return {
            filteredCases: datasets[0],
            filteredDeaths: datasets[1],
            filteredRecovered: datasets[2],
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
                    countsByDate[key] += Number(value);
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
        const { filteredCases, filteredRecovered } = get(filteredStates);
        const casesByDate = composeCountByDate(filteredCases);
        const recoveredByDate = composeCountByDate(filteredRecovered);
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
        const { filteredDeaths } = get(filteredStates);
        const deathsByDate = composeCountByDate(filteredDeaths);
        return Object.entries(deathsByDate).map(([key, value]) => {
            return {
                date: key,
                deaths: value,
            };
        });
    }
});

const composeCountByCountry = (data, date) => {
    const countsByCountry = {};
    data.forEach(place => {
        const country = place['Country/Region'];
        if (countsByCountry[country]) {
            // if the country exists already, add from supplied date
            countsByCountry[country] += Number(place[dayjs(date).format('M/D/YY')]);
        } else {
            countsByCountry[country] = Number(place[dayjs(date).format('M/D/YY')]);
        }
    });
    return countsByCountry;
}


export const topCasesByCountry = selector({
    key: 'topCasesByCountry',
    get: ({ get }) => {
        const cases = get(caseState)
        const { end: date } = get(dateState);
        const casesByCountry = composeCountByCountry(cases, date);
        return Object.entries(casesByCountry)
            .sort((a, b) => a[1] < b[1] ? 1 : -1)
            .map(([ key, value ]) => ({ label: key, value }))
            .slice(0, 6);
    }
});
