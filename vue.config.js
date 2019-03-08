const path = require('path');

function resolve (dir) {
    return path.join(__dirname, dir)
};

// Require the webpack-chain module. This module exports a single
// constructor function for creating a configuration API.
// const Config = require('webpack-chain');
// Instantiate the configuration with a new API
// const config = new Config();
module.exports = {
    // 基本路径
    baseUrl: './',
    // 输出文件目录
    outputDir: 'dist',

    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('routes',resolve('src/routes'))
            .set('store',resolve('src/store'))
            .set('components',resolve('src/components'))
            .set('views',resolve('src/views'))
            .set('lib',resolve('src/lib'))
            .set('assets',resolve('src/assets'));

            const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
            types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
	devServer: {
		proxy: {
            "/spoc-market":{
                target:'http://47.93.31.175:8192',
                pathRewrite: {
                    "^/spoc-market": "/spoc-market",
                }
            },
            "/a":{
                target:'http://ewechattest.ivygate.cn',
                pathRewrite: {
                    "^/a": "/a",
                }
            },
            "/spoc-choiceschool":{
                target:'http://47.93.31.175:8181',
                pathRewrite: {
                    "^/spoc-choiceschool": "/spoc-choiceschool",
                }
            },
            "/spoc-crm":{
                target:'http://47.93.31.175:8189',
                pathRewrite: {
                    "^/spoc-crm": "/spoc-crm",
                }
            },
		},
        port: 8193,
        // host: "172.16.0.171",
        // host: '0.0.0.0',
        disableHostCheck: true
    },
    productionSourceMap: false,
    assetsDir: './static',
};

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/lib/less/util.less'),
      ],
    });
}
