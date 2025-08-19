import * as React from 'react';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';

import { CardGridProps } from './types';

const BREAKPOINTS = {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
};

const useStyles = makeStyles({
    baseContainer: {
        width: '100%',
        marginRight: 'auto',
        marginLeft: 'auto',
        paddingLeft: tokens.spacingHorizontalL,
        paddingRight: tokens.spacingHorizontalL,
    },
    containerSm: {
        [`@media (min-width: ${BREAKPOINTS.sm})`]: {
            maxWidth: '100%',
        },
    },
    containerMd: {
        [`@media (min-width: ${BREAKPOINTS.md})`]: {
            maxWidth: '100%',
        },
    },
    containerLg: {
        [`@media (min-width: ${BREAKPOINTS.lg})`]: {
            maxWidth: '100%',
        },
    },
    containerXl: {
        [`@media (min-width: ${BREAKPOINTS.xl})`]: {
            maxWidth: '100%',
        },
    },
    containerXxl: {
        [`@media (min-width: ${BREAKPOINTS.xxl})`]: {
            maxWidth: '100%',
        },
    },
});

export const CardGrid: React.FC<CardGridProps> = ({ children, type, ...rest }) => {
    const styles = useStyles();

    let responsiveClass = '';
    switch (type) {
        case 'fluid':
            break;
        case 'sm':
            responsiveClass = styles.containerSm;
            break;
        case 'md':
            responsiveClass = styles.containerMd;
            break;
        case 'lg':
            responsiveClass = styles.containerLg;
            break;
        case 'xl':
            responsiveClass = styles.containerXl;
            break;
        case 'xxl':
            responsiveClass = styles.containerXxl;
            break;
        default:
            responsiveClass = styles.containerSm;
            break;
    }

    return (
        <div className={mergeClasses(styles.baseContainer, responsiveClass)} {...rest}>
            {children}
        </div>
    );
};