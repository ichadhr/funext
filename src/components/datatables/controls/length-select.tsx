"use client";

import { useEffect, useState } from 'react';
import { Select } from "@fluentui/react-components";
import { Api } from 'datatables.net-dt';
import React from 'react';
import { useDataTableStyles } from '../styles';

interface LengthSelectProps {
    tableRef: React.RefObject<{ dt: () => Api<unknown> } | null>;
    textBefore?: string;
    textAfter?: string;
    lengthLabels?: {
        [key: string]: string;
    };
}

interface DataTableSettings {
    aLengthMenu: Array<number | number[]>;
}

const LengthSelect = ({ tableRef, textBefore = "", textAfter = "", lengthLabels = { "-1": 'All' } }: LengthSelectProps): React.ReactElement => {
    const [length, setLength] = useState(10);
    const [options, setOptions] = useState([10, 25, 50, 100]);

    const parseMenuOptions = (settings: DataTableSettings): number[] => {
        if (!settings.aLengthMenu) return [10, 25, 50, 100];
        return settings.aLengthMenu.map(item =>
            Array.isArray(item) ? item[0] : item
        );
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

    return (
        <div
            className={styles.lengthSelectContainer}
            role="group"
            aria-label="Page length selection"
        >
            <span className={styles.lengthSelectLabel}>{textBefore}</span>
            <Select
                value={length.toString()}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className={styles.lengthSelectInput}
                aria-label="Page length select"
                disabled={!tableRef.current}
            >
                {options.map(option => (
                    <option key={option} value={option.toString()}>
                        {lengthLabels[option.toString()] || option}
                    </option>
                ))}
            </Select>
            <span className={styles.lengthSelectLabel}>{textAfter}</span>
        </div>
    );
};

export default LengthSelect;