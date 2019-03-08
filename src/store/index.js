import Vue from 'vue';
import Vuex from 'vuex';

import form from './form.js';
import util from './util';
import TaskDetail from './taskDetail';
import taskCenter from './taskCenter';
import order from './order.js';
import user from './user.js';
import expandWeal from './expandWeal.js';
import introductionPage from './introductionPage.js';
import location from './location.js';

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        form,
        util,
        TaskDetail,
        taskCenter,
        order,
        user,
        expandWeal,
        introductionPage,
        location,
    },
});

export default store;