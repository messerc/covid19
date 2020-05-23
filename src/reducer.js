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

const filteredGeoState = selector({
    key: 'filteredGeoState',
    get: ({ get }) => {

        // geo filters
        const [country, province] = [
            get(countryState),
            get(provinceState),
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

        return {
            filteredCases: datasets[0],
            filteredDeaths: datasets[1],
            filteredRecovered: datasets[2],
        }
    }
})

const composeCountByDate = (data, dates) => {
    const countsByDate = {};
    const dateRange = new Set();
    for (let date = dayjs(dates.start); date < dayjs(dates.end); date = dayjs(date).add(1, 'day')) {
        dateRange.add(dayjs(date).format('M/D/YY'));
    }
    data.forEach((place) => {
        Object.entries(place).forEach(([key, value]) => {
            // we have a date and its within the filter
            if (!isNaN(Date.parse(key)) && dateRange.has(key)) {
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
        const { filteredCases, filteredRecovered } = get(filteredGeoState);
        const dates = get(dateState);
        const casesByDate = composeCountByDate(filteredCases, dates);
        const recoveredByDate = composeCountByDate(filteredRecovered, dates);
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
        const { filteredDeaths } = get(filteredGeoState);
        const dates = get(dateState);
        const deathsByDate = composeCountByDate(filteredDeaths, dates);
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
        } else if (country) {
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
            .slice(0, 5);
    }
});
