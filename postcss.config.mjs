const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
      browsers: [">0.3%", "not dead", "not op_mini all"],
    }
  },
};
export default config;
