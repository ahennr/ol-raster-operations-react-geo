// Possible variables are listed here:
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
// TODO include this file in app to enforce reload on change
module.exports = () => {
  return {
    '@primary-color': '#248FD0',
    '@component-background': '#E9E9E9',
    '@measure-dynamic-tooltip-background-color': 'lighten(@primary-color, 10%)',
    '@measure-static-tooltip-background-color': '@primary-color'
  };
};
