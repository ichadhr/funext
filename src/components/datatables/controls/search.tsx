"use client";

import { useState } from 'react';
import { SearchBox, SearchBoxChangeEvent, InputOnChangeData } from "@fluentui/react-components";
import { useDataTableStyles } from '../styles';

interface SearchProps {
    onSearchChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export default function Search({ onSearchChange, placeholder = "", label = "Search:" }: SearchProps) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event: SearchBoxChangeEvent, data: InputOnChangeData) => {
        const value = data.value || '';
        setSearchValue(value);
        onSearchChange(value);
    };

    const styles = useDataTableStyles();

    return (
        <div className={styles.searchContainer}>
            <span className={styles.searchLabel}>{label}</span>
            <SearchBox
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
        </div>
    );
}