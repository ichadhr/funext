// src/components/grids/types.ts
// Define types related to CardGrid components here.

import * as React from 'react';

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    type?: 'fluid' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export type OffsetValue = number;
export type AlignSelfValue = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface CardGridColumnProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    col?: boolean;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xsAuto?: boolean;
    smAuto?: boolean;
    mdAuto?: boolean;
    lgAuto?: boolean;
    xlAuto?: boolean;
    xxlAuto?: boolean;
    alignSelf?: AlignSelfValue;
    offsetXs?: OffsetValue;
    offsetSm?: OffsetValue;
    offsetMd?: OffsetValue;
    offsetLg?: OffsetValue;
    offsetXl?: OffsetValue;
    offsetXxl?: OffsetValue;
    msAuto?: boolean;
    smMsAuto?: boolean;
    mdMsAuto?: boolean;
    lgMsAuto?: boolean;
    xlMsAuto?: boolean;
    xxlMsAuto?: boolean;
    meAuto?: boolean;
    smMeAuto?: boolean;
    mdMeAuto?: boolean;
    lgMeAuto?: boolean;
    xlMeAuto?: boolean;
    xxlMeAuto?: boolean;
}

export interface CardGridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    rowCols?: 'auto' | number | { [key in 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl']?: 'auto' | number };
    g?: number | '0';
    gx?: number | '0';
    gy?: number | '0';
    justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentXs?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentSm?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentMd?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentLg?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentXl?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    justifyContentXxl?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch';
}