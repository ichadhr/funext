"use client";

import { useState, useEffect } from 'react';
import { SearchBox, SearchBoxChangeEvent, InputOnChangeData, useId } from "@fluentui/react-components";
import { useDataTableStyles } from '../styles';
import { useDebounce } from '@hooks/use-debounce';
import { SearchProps } from '../types';


const Search = ({ onSearchChange, placeholder = "", label = "Search:" }: SearchProps) => {
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce for 500ms

    const handleSearchChange = (event: SearchBoxChangeEvent, data: InputOnChangeData) => {
        const value = data.value || '';
        setSearchValue(value);
    };

    // Call onSearchChange only when the debounced value changes
    useEffect(() => {
        onSearchChange(debouncedSearchValue);
    }, [debouncedSearchValue, onSearchChange]);

    const styles = useDataTableStyles();
    const tblSearchId = useId();

    return (
        <div className={styles.searchContainer}>
            <span className={styles.searchLabel}>{label}</span>
            <SearchBox
                id={tblSearchId}
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
        </div>
    );
}

export default Search;