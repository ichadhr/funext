import * as React from 'react';
import { makeStyles, GriffelStyle, mergeClasses } from '@fluentui/react-components';

import {
    AlignSelfValue,
    CardGridColumnProps
} from './types';

// Breakpoint configurations
const BREAKPOINTS = {
    xs: '',
    sm: '@media (min-width: 576px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 992px)',
    xl: '@media (min-width: 1200px)',
    xxl: '@media (min-width: 1400px)',
} as const;

// Helper functions for generating GriffelStyle objects
const getColumnStyles = (span: number): GriffelStyle => ({
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: `${(span / 12) * 100}%`,
    maxWidth: `${(span / 12) * 100}%`,
});

const getOffsetStyles = (offset: number): GriffelStyle => ({
    marginLeft: `${(offset / 12) * 100}%`,
});

const getAutoStyles = (): GriffelStyle => ({
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: 'auto',
    maxWidth: 'none',
});

// Function to generate all static styles for makeStyles
const generateAllColumnStyles = () => {
    const styles: Record<string, GriffelStyle> = {
        column: {
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: '0%',
            maxWidth: '100%',
            boxSizing: 'border-box',
        },
    };

    Object.entries(BREAKPOINTS).forEach(([breakpoint, mediaQuery]) => {
        // Column span styles
        for (let i = 1; i <= 12; i++) {
            const className = `col${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}${i}`;
            styles[className] = mediaQuery
                ? { [mediaQuery]: getColumnStyles(i) }
                : getColumnStyles(i);
        }

        // Auto column styles
        const autoClassName = `col${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}Auto`;
        styles[autoClassName] = mediaQuery
            ? { [mediaQuery]: getAutoStyles() }
            : getAutoStyles();

        // Offset styles
        for (let i = 0; i <= 12; i++) {
            const offsetClassName = `offset${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}${i}`;
            styles[offsetClassName] = mediaQuery
                ? { [mediaQuery]: getOffsetStyles(i) }
                : getOffsetStyles(i);
        }

        // Margin auto styles
        const msAutoClassName = breakpoint === 'xs' ? 'msAuto' : `${breakpoint}MsAuto`;
        const meAutoClassName = breakpoint === 'xs' ? 'meAuto' : `${breakpoint}MeAuto`;

        styles[msAutoClassName] = mediaQuery
            ? { [mediaQuery]: { marginLeft: 'auto' } }
            : { marginLeft: 'auto' };

        styles[meAutoClassName] = mediaQuery
            ? { [mediaQuery]: { marginRight: 'auto' } }
            : { marginRight: 'auto' };
    });

    // Alignment styles
    const alignments: AlignSelfValue[] = ['start', 'end', 'center', 'baseline', 'stretch'];
    alignments.forEach(alignment => {
        const className = `alignSelf${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`;
        styles[className] = {
            alignSelf: alignment === 'start' ? 'flex-start' : alignment === 'end' ? 'flex-end' : alignment,
        };
    });

    return styles;
};

const useStyles = makeStyles(generateAllColumnStyles());

type CardGridColumnClassNames = ReturnType<typeof useStyles>;

export const CardGridColumn: React.FC<CardGridColumnProps> = ({ children, ...rest }) => {
    const styles = useStyles();

    // Filter out custom props that should not be passed to the DOM element
    const {
        col, xs, sm, md, lg, xl, xxl,
        xsAuto, smAuto, mdAuto, lgAuto, xlAuto, xxlAuto,
        alignSelf,
        offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, offsetXxl,
        msAuto, smMsAuto, mdMsAuto, lgMsAuto, xlMsAuto, xxlMsAuto,
        meAuto, smMeAuto, mdMeAuto, lgMeAuto, xlMeAuto, xxlMeAuto,
        ...propsToPass
    } = rest;

    const classes: string[] = [];

    // Base column class
    const hasNoBreakpointProps = !(xs || sm || md || lg || xl || xxl ||
        xsAuto || smAuto || mdAuto || lgAuto || xlAuto || xxlAuto);

    if (col && hasNoBreakpointProps) {
        classes.push(styles.column);
    }

    // Column spans
    if (xs) classes.push(styles[`colXs${xs}`]);
    if (sm) classes.push(styles[`colSm${sm}`]);
    if (md) classes.push(styles[`colMd${md}`]);
    if (lg) classes.push(styles[`colLg${lg}`]);
    if (xl) classes.push(styles[`colXl${xl}`]);
    if (xxl) classes.push(styles[`colXxl${xxl}`]);

    // Auto column styles
    if (xsAuto) classes.push(styles.colXsAuto);
    if (smAuto) classes.push(styles.colSmAuto);
    if (mdAuto) classes.push(styles.colMdAuto);
    if (lgAuto) classes.push(styles.colLgAuto);
    if (xlAuto) classes.push(styles.colXlAuto);
    if (xxlAuto) classes.push(styles.colXxlAuto);

    // Alignment
    if (alignSelf) {
        const alignClassName = `alignSelf${alignSelf.charAt(0).toUpperCase() + alignSelf.slice(1)}` as keyof CardGridColumnClassNames;
        classes.push(styles[alignClassName]);
    }

    // Offsets
    if (offsetXs !== undefined) classes.push(styles[`offsetXs${offsetXs}`]);
    if (offsetSm !== undefined) classes.push(styles[`offsetSm${offsetSm}`]);
    if (offsetMd !== undefined) classes.push(styles[`offsetMd${offsetMd}`]);
    if (offsetLg !== undefined) classes.push(styles[`offsetLg${offsetLg}`]);
    if (offsetXl !== undefined) classes.push(styles[`offsetXl${offsetXl}`]);
    if (offsetXxl !== undefined) classes.push(styles[`offsetXxl${offsetXxl}`]);

    // Margin auto
    if (msAuto) classes.push(styles.msAuto);
    if (smMsAuto) classes.push(styles.smMsAuto);
    if (mdMsAuto) classes.push(styles.mdMsAuto);
    if (lgMsAuto) classes.push(styles.lgMsAuto);
    if (xlMsAuto) classes.push(styles.xlMsAuto);
    if (xxlMsAuto) classes.push(styles.xxlMsAuto);

    if (meAuto) classes.push(styles.meAuto);
    if (smMeAuto) classes.push(styles.smMeAuto);
    if (mdMeAuto) classes.push(styles.mdMeAuto);
    if (lgMeAuto) classes.push(styles.lgMeAuto);
    if (xlMeAuto) classes.push(styles.xlMeAuto);
    if (xxlMeAuto) classes.push(styles.xxlMeAuto);

    return (
        <div className={mergeClasses(...classes.filter(Boolean))} {...propsToPass}>
            {children}
        </div>
    );
};

CardGridColumn.displayName = 'CardGridColumn';
