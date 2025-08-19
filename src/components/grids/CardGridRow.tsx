import * as React from 'react';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';

import { CardGridRowProps } from './types';

// Breakpoint configuration
const BREAKPOINTS = {
    xs: '', // For xs, no min-width media query is applied
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
} as const;

// Mapping for gutter values to Fluent UI tokens
const GUTTER_MAP = {
    '0': '0px',
    '1': tokens.spacingHorizontalXXS,
    '2': tokens.spacingHorizontalXS,
    '3': tokens.spacingHorizontalS,
    '4': tokens.spacingHorizontalM,
    '5': tokens.spacingHorizontalL,
} as const;

// Helper to calculate flex-basis and width for row-cols
const calculateColSizing = (value: number | 'auto', columnGapVar: string) => {
    if (value === 'auto') {
        return { flexBasis: 'auto', width: 'auto' };
    }
    const flexBasis = `calc((100% - (${columnGapVar} * (${value} - 1))) / ${value})`;
    return { flexBasis, width: flexBasis };
};

// Helper to capitalize first letter
// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Generate styles dynamically
const generateRowGridStyles = () => {
    const styles: Record<string, object> = {};

    // Base row styles
    styles.row = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: '0',
        '& > *': {
            marginTop: '0',
            boxSizing: 'border-box',
        },
        columnGap: 'var(--row-column-gap, 0px)',
        rowGap: 'var(--row-row-gap, 0px)',
    };

    const colValues: Array<number | 'auto'> = ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const justifyContentValues = ['start', 'end', 'center', 'between', 'around', 'evenly'] as const;
    const alignItemsValues = ['start', 'end', 'center', 'baseline', 'stretch'] as const;
    const alignContentValues = ['start', 'end', 'center', 'between', 'around', 'stretch'] as const;

    // Generate row-cols classes (base and responsive)
    Object.entries(BREAKPOINTS).forEach(([breakpoint, minWidth]) => {
        colValues.forEach(value => {
            const suffix = value === 'auto' ? 'Auto' : value.toString();
            const { flexBasis, width } = calculateColSizing(value, 'var(--row-column-gap, 0px)');

            const style = {
                '& > *': {
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: flexBasis,
                    maxWidth: flexBasis,
                    width: width,
                }
            };

            if (breakpoint === 'xs') {
                styles[`rowCols${suffix}`] = style;
            } else {
                styles[`${breakpoint}RowCols${suffix}`] = {
                    [`@media (min-width: ${minWidth})`]: style
                };
            }
        });
    });

    // Generate justifyContent classes (base and responsive)
    Object.entries(BREAKPOINTS).forEach(([breakpoint, minWidth]) => {
        justifyContentValues.forEach(value => {
            const style = { justifyContent: value };
            if (breakpoint === 'xs') {
                styles[`justifyContent${capitalize(value)}`] = style;
            } else {
                styles[`justifyContent${capitalize(breakpoint)}${capitalize(value)}`] = {
                    [`@media (min-width: ${minWidth})`]: style
                };
            }
        });
    });

    // Generate alignItems classes
    alignItemsValues.forEach(value => {
        styles[`alignItems${capitalize(value)}`] = { alignItems: value };
    });

    // Generate alignContent classes
    alignContentValues.forEach(value => {
        styles[`alignContent${capitalize(value)}`] = { alignContent: value };
    });

    // Generate gutter classes (g, gx, gy)
    Object.entries(GUTTER_MAP).forEach(([key, value]) => {
        styles[`gx${key}`] = { '--row-column-gap': value };
        styles[`gy${key}`] = { '--row-row-gap': value };
        styles[`g${key}`] = {
            '--row-column-gap': value,
            '--row-row-gap': value,
        };
    });

    return styles;
};

// Define the type for the styles object returned by useStyles
type CardGridRowStyles = {
    row: string;
    [key: string]: string; // Catch-all for dynamically generated classes
};

const useStyles = makeStyles(generateRowGridStyles()) as unknown as () => CardGridRowStyles;

export const CardGridRow: React.FC<CardGridRowProps> = ({
    children,
    rowCols,
    g,
    gx,
    gy,
    justifyContent,
    justifyContentXs,
    justifyContentSm,
    justifyContentMd,
    justifyContentLg,
    justifyContentXl,
    justifyContentXxl,
    alignItems,
    alignContent,
    ...propsToPass
}) => {
    const styles = useStyles();

    const getRowColsClassNames = (): string[] => {
        if (!rowCols) return [];

        if (typeof rowCols === 'number' || rowCols === 'auto') {
            const suffix = rowCols === 'auto' ? 'Auto' : rowCols.toString();
            return [styles[`rowCols${suffix}`]];
        } else if (typeof rowCols === 'object') {
            return (Object.keys(rowCols) as Array<keyof typeof rowCols>).map(breakpoint => {
                const value = rowCols[breakpoint];
                if (value !== undefined) {
                    const suffix = value === 'auto' ? 'Auto' : value.toString();
                    const prefix = breakpoint === 'xs' ? '' : `${breakpoint}`;
                    return styles[`${prefix}rowCols${suffix}`];
                }
                return '';
            }).filter(Boolean);
        }
        return [];
    };

    const getGutterClassNames = (): string[] => {
        if (g !== undefined) {
            return [styles[`g${g}`]];
        } else {
            const classNames: string[] = [];
            if (gx !== undefined) {
                classNames.push(styles[`gx${gx}`]);
            }
            if (gy !== undefined) {
                classNames.push(styles[`gy${gy}`]);
            }
            return classNames;
        }
    };

    const getJustifyContentClassNames = (
        justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentXs?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentSm?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentMd?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentLg?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentXl?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
        justifyContentXxl?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
    ): string[] => {
        const classNames: string[] = [];
        const justifyProps = [
            { prop: justifyContent, prefix: '' },
            { prop: justifyContentXs, prefix: 'Xs' },
            { prop: justifyContentSm, prefix: 'Sm' },
            { prop: justifyContentMd, prefix: 'Md' },
            { prop: justifyContentLg, prefix: 'Lg' },
            { prop: justifyContentXl, prefix: 'Xl' },
            { prop: justifyContentXxl, prefix: 'Xxl' },
        ];

        for (const { prop, prefix } of justifyProps) {
            if (prop) {
                classNames.push(styles[`justifyContent${prefix}${capitalize(prop)}`]);
            }
        }
        return classNames;
    };

    const rowClass = mergeClasses(
        styles.row,
        ...getRowColsClassNames(),
        ...getJustifyContentClassNames(
            justifyContent,
            justifyContentXs,
            justifyContentSm,
            justifyContentMd,
            justifyContentLg,
            justifyContentXl,
            justifyContentXxl
        ),
        alignItems && styles[`alignItems${capitalize(alignItems)}`],
        alignContent && styles[`alignContent${capitalize(alignContent)}`],
        ...getGutterClassNames()
    );

    return (
        <div className={rowClass} {...propsToPass}>
            {children}
        </div>
    );
};
