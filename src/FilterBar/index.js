import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import {
    dateState,
    countryState,
    provinceState,
} from '../reducer';

const FilterBar = ({ cases }) => {
    const [{ min, max }, setMinMax] = useState({ min: null, max: null })
    const [dateRange, setDateRange] = useRecoilState(dateState);
    const [country, setCountry] = useRecoilState(countryState);
    const [province, setProvince] = useRecoilState(provinceState);

    useEffect(() => {
        if (Boolean(cases.length)) {
            const allDates = Object.keys(cases[0])
                .filter(key => !isNaN(Date.parse(key)));
            const _min = dayjs(allDates[0]).format('YYYY-MM-DD');
            const _max = dayjs(allDates[allDates.length - 1]).format('YYYY-MM-DD');
            setMinMax({ min: _min, max: _max });
            setDateRange({
                start: _min,
                end: _max,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const clearFilters = () => {
        setCountry('');
        setProvince('');
        setDateRange({ start: min, end: max });
    }

    const provinces = cases
        .filter(place => place['Province/State'])
        // filter out provinces not relevant if a country is selected
        .filter(place => country ? place['Country/Region'] === country : true)
        .map(place => place['Province/State']);

    const countries = Array.from(
        new Set(
            cases
                // filter out provinces not relevant if a country is selected
                .filter(place => province ? place['Province/State'] === province : true)
                .map(place => place['Country/Region'])
        )
    );
    return (
        <div>
            <button onClick={clearFilters}>Clear filters</button>
            <h6>province</h6>
            <select value={province} onChange={e => setProvince(e.target.value)} name="province/state">
                <option value={''} key="province-all">
                    All
                </option>
                {provinces
                    .map(province => (
                        <option value={province} key={province}>
                            {province}
                        </option>
                    ))}
            </select>
            <h6>country</h6>
            <select value={country} onChange={e => setCountry(e.target.value)} name="country/region">
                <option value={''} key="country-all">
                    All
                </option>
                {countries.map((country, i) => (
                    <option value={country} key={country + i}>
                        {country}
                    </option>
                ))}
            </select>
            <h6>dates</h6>
            <input min={min} max={max} type="date" value={dateRange.start} onChange={e => setDateRange({ start: e.target.value, end: dateRange.end })}/>
            <input min={min} max={max} type="date" value={dateRange.end} onChange={e => setDateRange({ start: dateRange.start, end: e.target.value })} />
        </div>
    )
}

export default FilterBar;
