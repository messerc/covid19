import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import {
    dateState,
    countryState,
    provinceState,
} from '../reducer';

const FilterContainer = styled.div`
    display: flex;
    position: relative;
    align-items: flex-end;
    > div {
        margin-right: 3rem;
        min-width: 150px;
    }
`;

const Button = styled.button`
    position: absolute;
    right: 0;
    top: -1rem;
`;

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

    const countries = Array.from(new Set(cases.map(place => place['Country/Region'])));

    const updateCountry = e => {
        setCountry(e.target.value);
        // whenever selecting a new country, province should be reset
        setProvince(null);
    }
    const updateProvince = e => setProvince(e.target.value);
    const updateStartDate = e => setDateRange({ start: e.target.value, end: dateRange.end });
    const updateEndDate = e => setDateRange({ start: dateRange.start, end: e.target.value });

    return (
        <FilterContainer>
            <Button onClick={clearFilters}>Clear filters</Button>
            <div>
                <h6>country</h6>
                <select value={country} onChange={updateCountry} name="country/region">
                    <option value={''} key="country-all">
                        All
                    </option>
                    {countries.map((country, i) => (
                        <option value={country} key={country + i}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
            {country && Boolean(provinces.length) && (
                <div>
                    <h6>province</h6>
                    <select value={province} onChange={updateProvince} name="province/state">
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
                </div>
            )}
            <div style={{ marginLeft: 'auto' }}>
                <h6>dates</h6>
                <input style={{ marginRight: '1rem' }} min={min} max={max} type="date" value={dateRange.start} onChange={updateStartDate}/>
                to 
                <input style={{ marginLeft: '1rem' }} min={min} max={max} type="date" value={dateRange.end} onChange={updateEndDate} />
            </div>
        </FilterContainer>
    )
}

export default FilterBar;
