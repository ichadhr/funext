"use client";

import { useEffect, useState } from 'react';
import { Select } from "@fluentui/react-components";
import { Api } from 'datatables.net-dt';

interface lengthSelectProps {
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>;
    textBefore?: string;
    textAfter?: string;
    lengthLabels?: {
        [key: string]: string;
    };
}

export interface DataTableApi {
    page: {
        len: (length?: number) => number;
    };
    draw: () => void;
    settings: () => Array<{
        aLengthMenu: Array<number | number[]>;
    }>;
}

const LengthSelect = ({ tableRef, textBefore = "", textAfter = "", lengthLabels = { "-1": 'All' } }: lengthSelectProps) => {
    const [length, setLength] = useState(10);
    const [options, setOptions] = useState([10, 25, 50, 100]);

    // Parse menu options from DataTable settings
    const parseMenuOptions = (settings: { aLengthMenu: Array<number | number[]> }) => {
        if (!settings.aLengthMenu) return [10, 25, 50, 100];
        return settings.aLengthMenu.map(item =>
            Array.isArray(item) ? item[0] : item
        );
    };

    // Initialize with the current page length and get options from DataTable
    useEffect(() => {
        if (!tableRef.current) return;

        const table = tableRef.current.dt();
        if (!table) return;

        const currentLength = table.page.len();
        setLength(currentLength);

        const settings = table.settings()[0];
        setOptions(parseMenuOptions(settings));
    }, [tableRef]);

    const handleLengthChange = (value: number) => {
        setLength(value);
        if (tableRef.current) {
            const table = tableRef.current.dt();
            if (table) {
                table.page.len(value);
                table.draw();
            }
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0, padding: 0 }}>
            <span style={{ margin: 0, padding: 0 }}>{textBefore}</span>
            <Select
                value={length.toString()}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                style={{ width: 'auto', minWidth: '60px'}}
                aria-label="Page length select"
            >
                {options.map(option => (
                    <option key={option} value={option.toString()}>
                        {lengthLabels[option.toString()] || option}
                    </option>
                ))}
            </Select>
            <span style={{ margin: 0, padding: 0 }}>{textAfter}</span>
        </div>
    );
};

export default LengthSelect;