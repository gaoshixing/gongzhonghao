import Vue from 'vue';
import Router from 'vue-router';
import {
    dealHash,
    setTitle,
    checkUserInfo,
    jssdkConfig,
    dealQs,
} from 'lib/script/hook';

import Routers from './router';

Vue.use(Router);
const router = new Router({
    routes: [],
});
router.addRoutes(Routers); // 添加模块路由
router.beforeEach(checkUserInfo); // 是否获取到用户信息
router.afterEach(dealHash); // 处理 hash
router.afterEach(setTitle); // 设置页面标题

export default router;