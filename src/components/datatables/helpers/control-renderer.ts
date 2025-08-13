"use client";

import { createRoot } from 'react-dom/client';
import React from 'react';

interface ControlRendererProps {
  component: React.ReactElement | null;
}

export const ControlRenderer = ({ component }: ControlRendererProps): (() => HTMLElement) => {
  const renderControl = (): HTMLElement => {
    const toolbar = document.createElement('div');
    const root = createRoot(toolbar);

    if (component) {
      root.render(component);
    }

    return toolbar;
  };

  return renderControl;
};