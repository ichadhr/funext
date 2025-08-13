// next.config.js
import type { NextConfig } from 'next';
import FluentUIReactIconsFontSubsettingPlugin from '@fluentui/react-icons-font-subsetting-webpack-plugin';

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
  // Webpack-specific configuration
  webpack: (config) => {
    // Ensure we have a valid config to work with
    const webpackConfig = {
      ...config,
      module: config.module || { rules: [] },
      resolve: config.resolve || { conditionNames: [] },
      plugins: config.plugins || [],
    };

    // Add the font file rule
    webpackConfig.module.rules.push({
      test: /\.(ttf|woff2?)$/,
      type: 'asset',
    });

    // Add the conditionNames configuration
    webpackConfig.resolve.conditionNames.push('fluentIconFont');

    // Add the plugin
    webpackConfig.plugins.push(new FluentUIReactIconsFontSubsettingPlugin());

    return webpackConfig;
  },
  // Turbopack configuration for Next.js 13.0.0 - 15.2.x
  experimental: {
    turbo: {
      rules: {
        '*.ttf': {
          loaders: ['file-loader'],
          as: '*.ttf',
        },
        '*.woff': {
          loaders: ['file-loader'],
          as: '*.woff',
        },
        '*.woff2': {
          loaders: ['file-loader'],
          as: '*.woff2',
        },
      },
    },
  },
};

export default nextConfig;
