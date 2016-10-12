import flow from 'rollup-plugin-flow'

export default {
  entry: 'src/index.js',
  plugins: [flow()],
  format: 'iife'
}
