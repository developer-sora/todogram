module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        targets: {
          browsers: '> 0.25%, not dead',
        },
      },
    ],
  ],
};
