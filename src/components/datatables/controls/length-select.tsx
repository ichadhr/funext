"use client";

import React, { useEffect, useState } from 'react';
import { Select, useId } from "@fluentui/react-components";
import { useDataTableStyles } from '../styles';
import { DataTableSettings, LengthSelectProps } from '../types';


const LengthSelect = ({ tableRef, textBefore = "", textAfter = "", lengthLabels = { "-1": 'All' } }: LengthSelectProps): React.ReactElement => {
    const [length, setLength] = useState(10);
    const [options, setOptions] = useState([10, 25, 50, -1]);

    const parseMenuOptions = (settings: DataTableSettings): number[] => {
        // DataTables' internal default for aLengthMenu if not explicitly set
        const dataTablesDefaultSimpleLengthMenu = [10, 25, 50, 100];

        // Handle the case where aLengthMenu is a nested array (values and labels)
        if (Array.isArray(settings.aLengthMenu) && Array.isArray(settings.aLengthMenu[0])) {
            return (settings.aLengthMenu[0] as number[]);
        }

        // Handle the case where aLengthMenu contains objects like { label: 'All', value: -1 }
        if (Array.isArray(settings.aLengthMenu) && settings.aLengthMenu.some(item => typeof item === 'object' && item !== null && 'value' in item)) {
            return settings.aLengthMenu.map(item => typeof item === 'object' && item !== null && 'value' in item ? item.value : item) as number[];
        }

        // If it's DataTables' default simple array, we apply our custom default
        if (Array.isArray(settings.aLengthMenu) &&
            settings.aLengthMenu.length === dataTablesDefaultSimpleLengthMenu.length &&
            (settings.aLengthMenu as number[]).every((val, index) => val === dataTablesDefaultSimpleLengthMenu[index])) {
            return [10, 25, 50, -1];
        }

        // Otherwise, assume it's a simple array of numbers set by the user
        return settings.aLengthMenu as number[];
    };

    useEffect(() => {
        if (!tableRef.current) {
            return;
        }

        const table = tableRef.current.dt();
        if (!table) {
            return;
        }

        const currentLength = table.page.len();
        setLength(currentLength);

        const settings = table.settings()[0];
        setOptions(parseMenuOptions(settings));
    }, [tableRef]);

    const handleLengthChange = (value: number): void => {
        setLength(value);
        if (tableRef.current) {
            const table = tableRef.current.dt();
            if (table) {
                table.page.len(value);
                table.draw();
            }
        }
    };

    const styles = useDataTableStyles();
    const tblPageLengthtId = useId();

    return (
        <div
            className={styles.lengthSelectContainer}
            role="group"
            aria-label="Page length selection"
        >
            <span className={styles.lengthSelectLabel}>{textBefore}</span>
            <Select
                id={tblPageLengthtId}
                value={length.toString()}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className={styles.lengthSelectInput}
                aria-label="Page length select"
                disabled={!tableRef.current}
            >
                {options.map(option => {
                    // Directly use the label from lengthLabels if available, otherwise use the option value
                    const displayLabel = lengthLabels[option.toString()] || option;
                    return (
                        <option key={option} value={option.toString()}>
                            {displayLabel}
                        </option>
                    );
                })}
            </Select>
            <span className={styles.lengthSelectLabel}>{textAfter}</span>
        </div>
    );
};

export default LengthSelect;