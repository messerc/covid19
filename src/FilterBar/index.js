import React from 'react';

const FilterBar = () => {
    return (
        <div>
            <input style={{ width: '300px' }} type="text" placeholder="search region..." />
            <input type="date" />
            <input type="date" />
        </div>
    )
}

export default FilterBar;
