import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import {
    dateState,
    countryState,
    provinceState,
} from '../reducer';

const DateContainer = styled.div`
    > h6 {
        margin-top: 1rem;
    }
    > input {
        font-size: 0.8em;
        margin: 0 1rem;

        // default date picker is not good
        &:before {
            position: absolute;
            top: 3px; left: 3px;
            content: attr(data-date);
            display: inline-block;
            color: black;
        }
        
        &::-webkit-inner-spin-button, &::-webkit-clear-button {
            display: none;
        }
        
    }
`;

const GeoFilterContainer = styled.div`
    display: flex;
    position: relative;
    align-items: flex-end;
    > div {
        margin-right: 3rem;
        min-width: 150px;
        > select {
            font-size: 0.8em;
        }
    }
`;

const Button = styled.button`
    margin: 0 1rem 1rem auto;
`;

const datePickerFormat = 'YYYY-MM-DD';

const FilterBar = ({ cases }) => {
    const [{ min, max }, setMinMax] = useState({ min: '', max: '' })
    const [dateRange, setDateRange] = useRecoilState(dateState);
    const [country, setCountry] = useRecoilState(countryState);
    const [province, setProvince] = useRecoilState(provinceState);

    useEffect(() => {
        const allDates = Object.keys(cases[0])
            .filter(key => !isNaN(Date.parse(key)));
        const _min = dayjs(allDates[0]).format(datePickerFormat);
        const _max = dayjs(allDates[allDates.length - 1]).format(datePickerFormat);
        setMinMax({ min: _min, max: _max });
        setDateRange({ start: _min, end: _max });
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
        <div style={{ borderBottom: '1px solid gray', marginBottom: '1rem', paddingBottom: '1rem' }}>
            <GeoFilterContainer>
                <div>
                    <h6>Country</h6>
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
                        <h6>Province</h6>
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
                <Button onClick={clearFilters}>Clear filters</Button>
            </GeoFilterContainer>
            <DateContainer>
                <h6>Dates</h6>
                <input
                    style={{ marginLeft: 0 }}
                    min={min}
                    max={dayjs(dateRange.end).subtract(1, 'day').format(datePickerFormat)}
                    type="date"
                    value={dateRange.start}
                    onChange={updateStartDate}
                />
                to 
                <input
                    min={dayjs(dateRange.start).add(1, 'day').format(datePickerFormat)}
                    max={max}
                    type="date"
                    value={dateRange.end}
                    onChange={updateEndDate}
                />
            </DateContainer>
        </div>
    )
}

export default FilterBar;
