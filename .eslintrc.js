module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-unresolved': 0,
    'no-mixed-spaces-and-tabs': 'off', // 关闭禁止使用 tab 和 空格
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
