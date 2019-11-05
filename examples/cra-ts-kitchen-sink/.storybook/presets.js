const path = require('path');

module.exports = [
  {
    name: '@storybook/preset-create-react-app',
    options: {
      tsDocgenLoaderOptions: {
        tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        shouldExtractLiteralValuesFromEnum: true,
      },
    },
  },
  '@storybook/addon-docs/react/preset',
];
