import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

import { CardGridProps } from './types';

const getContainerStyles = (minWidth: string) => ({
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    [`@media (min-width: ${minWidth})`]: {
        maxWidth: '100%',
    },
});

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
    // Default fixed-width container (.container)
    defaultContainer: getContainerStyles('576px'),
    // Fluid container (.container-fluid)
    fluid: {
        width: '100%',
    },
    // Responsive containers (.container-{breakpoint})
    containerSm: getContainerStyles('576px'),
    containerMd: getContainerStyles('768px'),
    containerLg: getContainerStyles('992px'),
    containerXl: getContainerStyles('1200px'),
    containerXxl: getContainerStyles('1400px'),
});

export const CardGrid: React.FC<CardGridProps> = ({ children, type, ...rest }) => {
    const styles = useStyles();
    let containerClass;

    const effectiveContainerType = type;

    switch (effectiveContainerType) {
        case 'fluid':
            containerClass = styles.fluid;
            break;
        case 'sm':
            containerClass = styles.containerSm;
            break;
        case 'md':
            containerClass = styles.containerMd;
            break;
        case 'lg':
            containerClass = styles.containerLg;
            break;
        case 'xl':
            containerClass = styles.containerXl;
            break;
        case 'xxl':
            containerClass = styles.containerXxl;
            break;
        default:
            containerClass = styles.defaultContainer; // Default to .container
    }
    return (
        <div className={`${styles.container} ${containerClass}`} {...rest}>
            {children}
        </div>
    );
};