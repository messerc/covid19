import React from 'react';
import { useRecoilState } from 'recoil';
import {
    dateState,
    countryState,
    provinceState,
} from '../reducer';

const FilterBar = ({ cases }) => {
    const [dateRange, setDateRange] = useRecoilState(dateState);
    const [country, setCountry] = useRecoilState(countryState);
    const [province, setProvince] = useRecoilState(provinceState);

    const provinces = cases
        .filter(place => place['Province/State'])
        // filter out provinces not relevant if a country is selected
        .filter(place => country ? place['Country/Region'] === country : true)
        .map(place => place['Province/State']);

    const countries = Array.from(
        new Set(
            cases
                .filter(place => province ? place['Province/State'] === province : true)
                .map(place => place['Country/Region'])
        )
    );

    const clearFilters = () => {
        setCountry(null);
        setProvince(null);
        setDateRange({ start: null, end: null });
    }

    return (
        <div>
            <button onClick={clearFilters}>Clear filters</button>
            <select onChange={e => setProvince(e.target.value)} name="province/state">
                {provinces
                    .map(province => (
                        <option value={province} key={province}>
                            {province}
                        </option>
                    ))}
            </select>
            <select onChange={e => setCountry(e.target.value)} name="country/region">
                {countries.map((country, i) => (
                    <option value={country} key={country + i}>
                        {country}
                    </option>
                ))}
            </select>
            <input type="date" />
            <input type="date" />
        </div>
    )
}

export default FilterBar;
