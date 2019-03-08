const Login = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/login.vue'));
    }, 'Login');
};

const BindStuTel = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/bindStuTel.vue'));
    }, 'BindStuTel');
};

const GroupBuy = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/groupBuy.vue'));
    }, 'GroupBuy');
};

const Buy = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/buy.vue'));
    }, 'Buy');
};

const ConfirmPay = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/confirmPay.vue'));
    }, 'ConfirmPay');
};

const myOrder = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/myOrder.vue'));
    }, 'myOrder');
};

const ConfirmInfo = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/confirmInfo.vue'));
    }, 'ConfirmInfo');
};

const ExpanderSignUp = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/expanderSignUp.vue'));
    }, 'ExpanderSignUp');
};

const ExpandWeal = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/expandWeal.vue'));
    }, 'ExpandWeal');
};

const TaskCenter = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/taskCenter.vue'));
    }, 'TaskCenter');
};

const TaskDetail = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/taskDetail.vue'));
    }, 'TaskDetail');
};

const PersonalCenter = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/personalCenter.vue'));
    }, 'PersonalCenter');
};

const PostDetail = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/postDetail.vue'));
    }, 'PostDetail');
};
const invite = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/invite.vue'));
    }, 'invite');
};
const PreviewPage = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/previewPage.vue'));
    }, 'PreviewPage');
};
const ImgText = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/imgText.vue'));
    }, 'ImgText');
};
const ImgAudioVideo = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/ImgAudioVideo.vue'));
    }, 'ImgAudioVideo');
};
const introductionPage = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/introductionPage.vue'));
    }, 'introductionPage');
};
const location = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/location.vue'));
    }, 'location');
};
const successBuy = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/successBuy.vue'));
    }, 'successBuy');
};
const successBuyNokeep = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/successBuyNokeep.vue'));
    }, 'successBuyNokeep');
}
const Building = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/building.vue'));
    }, 'Building');
};
const OrderDetail = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/orderDetail.vue'));
    }, 'OrderDetail');
};
const PersonalTaskDetail = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/personalTaskDetail.vue'));
    }, 'PersonalTaskDetail');
};
const bindInfor = resolve => {
    require.ensure([], (require) => {
        resolve(require('views/bindInfor.vue'));
    }, 'bindInfor');
};

export default [
    {
        path: '/expanderSignUp',
        name: 'expanderSignUp',
        component: ExpanderSignUp,
        meta: {
            title: '推广员报名表',
            noShare: true,
        },
    },
    {
        path: '/bindStuTel',
        name: 'bindStuTel',
        component: BindStuTel,
        meta: {
            title: '绑定学生电话',
            noShare: true,
        },
    },
    {
        path: '/myOrder',
        name: 'myOrder',
        component: myOrder,
        meta: {
            title: '我的订单',
            noShare: true,
        },
    },
    {
        path: '/confirmInfo',
        name: 'confirmInfo',
        component: ConfirmInfo,
        meta: {
            title: '确认信息',
            noShare: true,
        },
    },
    {
        path: '/groupBuy',
        name: 'groupBuy',
        component: GroupBuy,
        meta: {
            title: '拼团',
        },
    },
    {
        path: '/buy',
        name: 'buy',
        component: Buy,
        meta: {
            title: '详情',
        },
    },
    {
        path: '/confirmPay',
        name: 'confirmPay',
        component: ConfirmPay,
        meta: {
            title: '确认支付',
            noShare: true,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '推广员登录',
            noShare: true,
        },
    },
    {
        path: '/expandWeal',
        name: 'expandWeal',
        component: ExpandWeal,
        meta: {
            title: '推广返利',
            noShare: true,
        },
    },
    {
        path: '/taskCenter',
        name: 'taskCenter',
        component: TaskCenter,
        meta: {
            title: '任务中心',
            noShare: true,
        },
    },
    {
        path: '/taskDetail',
        name: 'taskDetail',
        component: TaskDetail,
        meta: {
            title: '详情',
            noShare: true,
        },
    },
    {
        path: '/personalCenter',
        name: 'personalCenter',
        component: PersonalCenter,
        meta: {
            title: '个人中心',
            noShare: true,
        },
    },
    {
        path: '/postDetail',
        name: 'postDetail',
        component: PostDetail,
        meta: {
            title: '详情',
            noShare: true,
        },
    },
    {
        path: '/invite',
        name: 'invite',
        component: invite,
        meta: {
            title: '邀请报名',
        },
    },
    {
        path: '/previewPage',
        name: 'previewPage',
        component: PreviewPage,
        meta: {
            title: '任务预览',
            noShare: true,
        },
    },
    {
        path: '/imgText',
        name: 'imgText',
        component: ImgText,
        meta: {
            title: '',
        },
    },
    {
        path: '/imgAudioVideo',
        name: 'ImgAudioVideo',
        component: ImgAudioVideo,
        meta: {
            title: '',
        },
    },
    {
        path: '/introductionPage',
        name: 'introductionPage',
        component: introductionPage,
        meta: {
            title: '扫码关注',
        },
    },
    {
        path: '/location',
        name: 'location',
        component: location,
        meta: {
            title: '位置',
            noShare: true,
        },
    },
    {
        path: '/successBuy',
        name: 'successBuy',
        component: successBuy,
        meta: {
            title: '购买成功',
        },
    },
    {
        path: '/successBuyNokeep',
        name: 'successBuyNokeep',
        component: successBuyNokeep,
        meta: {
            title: '购买成功',
        }
    },
    {
        path: '/building',
        name: 'building',
        component: Building,
        meta: {
            title: '关注订阅号',
        },
    },
    {
        path: '/orderDetail',
        name: 'orderDetail',
        component: OrderDetail,
        meta: {
            title: '',
        },
    },
    {
        path: '/personalTaskDetail',
        name: 'personalTaskDetail',
        component: PersonalTaskDetail,
        meta: {
            title: '本次任务推广详情',
        },
    },
    {
        path: '/bindInfor',
        name: 'bindInfor',
        component: bindInfor,
        meta: {
            title: '绑定手机号',
        },
    },
];