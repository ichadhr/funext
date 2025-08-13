"use client";

import { useState } from 'react';
import { SearchBox, SearchBoxChangeEvent, InputOnChangeData } from "@fluentui/react-components";

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

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0, padding: 0 }}>
            <span style={{ margin: 0, padding: 0 }}>{label}</span>
            <SearchBox
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearchChange}
            />
        </div>
    );
}