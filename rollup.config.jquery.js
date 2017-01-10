import flow from 'rollup-plugin-flow'

export default {
  entry: 'src/cc-jquery.js',
  plugins: [flow()],
  format: 'iife'
}
