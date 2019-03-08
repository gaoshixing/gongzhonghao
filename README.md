## 市场营销微信端

```node
+-- assets
+-- components
+-- lib
|   +-- less
|   |   +-- common.less 公共样式定义区域
|   |   +-- util.less less函数及公共类名
|   +-- script
|   +-- plugins
+-- routes
+-- store
+-- views
+-- main.js
```

### 启动
```bash
npm run serve
```

### 说明

- 路由
  - 使用懒加载 + 模块化
- [vuex](https://vuex.vuejs.org/zh/)
  - 单文件形式 + 模块化引入
- [mockjs](https://github.com/nuysoft/Mock/wiki/Getting-Started)
  - 与单文件vuex对应，模拟请求<!-- 取消 -->
- [mint-ui](http://mint-ui.github.io/docs/#/zh-cn2)
  - ui框架， 按需引入
- [vue-lazyload](https://github.com/hilongjw/vue-lazyload)
  - 图片懒加载

### 调试与维护
  - 路由模式
    - http://****:8193?router=路由名
    ```javascript
        //  例如 ...
        http://192.168.10.128:8193?router=taskCenter // 任务中心
    ```
    ```javascript
        //  线上服务器的持续集成
        1. clone 后台代码  ssh://git@gitlab.ivygate.cn:10022/ivygate/spoc-market-wechat.git
        2. npm run build 打包前端代码
        3. 将打包完成的代码复制粘贴到后台项目的 /src/main/webapp 目录下;
        4. 推送后台代码
    ```
  - 本地 jssdk 验证
    - nginx配置
        ```javascript
            server {
              listen      80;
              server_name  ewechattest.ivygate.cn/index.html;

              #charset koi8-r;

              #access_log  logs/host.access.log  main;

              location / {
                  # root   html;
                  # index  index.html index.htm;
                  proxy_pass  http://192.168.10.128:8193; // 需要映射的地址
              }

              #error_page  404              /404.html;

              # redirect server error pages to the static page /50x.html
              #
              error_page   500 502 503 504  /50x.html;
              location = /50x.html {
                  root   html;
              }
        ```
    - 本机 host 设置
      ```javascript
      192.168.10.128      ewechattest.ivygate.cn
      // IPv4地址          域名
      ```

    **tips**

    1. 开启 nginx 代理时; 需要将 **store/user.js** 中**getUserInfo**方法内的注释打开; 其他的注释
    2. 请求部分页面的时候需要进行验证;所以页面的地址与平常的不太相似;也就导致了每页需要重新进行jssdk验证

- 真机调试 [spy-debugger](https://www.npmjs.com/package/spy-debugger)

  - 工具下载
    - windows 
      ```bash
        npm install spy-debugger -g 
      ```
    - Mac
      ```bash
        sudo npm install spy-debugger -g
      ```
  - 启动
    ```bash
    spy-debugger
    ```
  - 要求
    ```css
    1. 手机与电脑处于同一WiFi下
    2. 设置该WiFi的配置代理, 改为 手动
    3. 服务器为电脑的IPv4地址 端口号设为9888(默认端口)
    ```
    ​

#### tips

**vue.config.js**

```javascript
chainWebpack: config => {
  // 别名设置
  config.resolve.alias
      .set('@', resolve('src'))
      .set('routes',resolve('src/routes'))
      .set('store',resolve('src/store'))
      .set('components',resolve('src/components'))
      .set('views',resolve('src/views'))
      .set('lib',resolve('src/lib'))
      .set('assets',resolve('src/assets'));
  // 样式文件全局注入
  const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
  types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
```

```javascript
// 接口映射
devServer {
    
};
```

**.eslintrc.js**

```css
// esLint 规则设置
```

**全局**

```javascript
// 接口请求时的loading
// 修改store对象下的util的requesting; 已准确控制当前是否存在请求状态
// 开始
store.commit('startRequest');
// 结束
store.commit('endRequest');
```

