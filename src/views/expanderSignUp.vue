<template>
    <div class="bg-gsx" id='bg-gsx'>
        <div class="expander-sign-up">
            <div class="ban-header">
                <div>   
                    <img class="bg-img" v-lazy="qs.isPreview?fileUrlObj.filePath3:fileUrlObj.filePath1" alt="">
                    <button class="become" v-if="isShowButton" @click="becomeExpand">立即成为推广员</button>
                </div>
                <!-- <img class="bg-img" style="visibility:hidden" v-lazy="qs.isPreview?fileUrlObj.filePath3:fileUrlObj.filePath1" alt=""> -->
            </div>
            <img class="bg-img" v-lazy="qs.isPreview?fileUrlObj.filePath2:fileUrlObj.filePath" alt="">
            <div class="expander-info-container white">
                <!-- <p class="join-us">提交以下信息加入我们</p>
                <ul>
                    <li><p>姓名</p><input type="text" placeholder="请输入您的姓名" v-model="name"></li>
                    <li class="line"></li>
                    <li><p>手机号码</p><input type="tel" placeholder="请输入您的手机号" v-model="tel"><span class="code" @click="onclickGetAuthCode">{{buttonText}}</span></li>
                    <li class="line"></li>
                    <li><p>验证码</p><input type="number" placeholder="请输入验证码" v-model="authCode"></li>
                </ul> -->
                <p class="join-us1">
                    <span class='title-line'></span>
                    <span style="vertical-align:middle">提交以下信息加入我们</span>
                    <span class='title-line'></span>
                </p>
                <ul class="new-table">
                    <li>
                        <p><i>*</i>您的姓名</p>
                        <input type="text" placeholder="请输入您的姓名" v-model="name"></li>
                    <!-- <li class="line"></li> -->
                    <li><p><i>*</i>您的手机号码</p><input type="tel" placeholder="请输入您的手机号" v-model="tel"><span class="code" @click="onclickGetAuthCode">{{buttonText}}</span></li>
                    <li class="line"></li>
                    <li><p><i>*</i>验证码</p><input type="number" placeholder="请输入验证码" v-model="authCode"></li>
                </ul>
                <div class="button-container mtb">
                    <button class="button-disabled mb" v-if="qs.isSubmit" >提交报名信息</button>
                    <button class="button-large mb" v-else @click="onclickLogin">提交报名信息</button>
                </div>
            </div>
            <mt-popup
                class="mint-popup-box"
                v-model="popupAttention"
                popup-transition="popup-fade"
                :closeOnClickModal=false>
                <div class="popup-attention">
                    <div>
                        <img src="../assets/img/attention.png" alt="">
                        <p>您的推广员账号已停用，</p>
                        <p>您可联系市场老师询问详情！</p>
                    </div>
                    <button @click="onclickSure">确定</button>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script>
import { mapState, } from 'vuex';
import { MessageBox, Popup, Toast, } from 'mint-ui';
import { dealQs, } from 'lib/script/hook.js';
import { registerShare, waitUntil, } from 'lib/script/util.js';
import store from 'store/index.js';

export default {
    name: 'SignUp',
    components: {
        'mt-popup': Popup,
    },
    data() {
        return {
            isShowButton: false,
            getting: false, // 读秒是否结束
            buttonText: '获取验证码',
            name: '',
            tel: '',
            authCode: null,
            popupAttention: false,
            studentId: '',
            status: null,
            qs: {},
            fileUrlObj: {
                appId: '',
                filePath3: '',
                filePath1: '',
            },
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            appId: state => state.user.userInfo.appId
        }),
    },
    async created() {
        this.qs = dealQs();
        const _this = this;
        if (!this.userInfo) await store.dispatch('getUserInfo');
        let obj = {
            appId: this.appId, 
            // appId: '24dbafe3894e407aac7fe02c57edbcc2', 
            type: 'spread'
        }
        store.commit('startRequest');
        let rdata = await store.dispatch('form', obj);
        let json = rdata.data.data.json
        if (json) {
            this.fileUrlObj = JSON.parse(json)
            this.isShowButton = true
        }
        store.commit('endRequest');
        if (this.qs.status === 'reject') {
            MessageBox({
                title: '报名失败！',
                message: '您的推广员报名被拒绝！您可联系市场老师询问详情！！',
                showCancelButton: false,
                closeOnClickModal: false,
            }).then(res => {
                wx.closeWindow();
            });
        } else if (this.qs.status === 'unaudit') {
            MessageBox({
                title: '完成报名！',
                message: '您已完成推广员报名！系统将尽快审核您的信息，请您静候佳音！',
                showCancelButton: false,
                closeOnClickModal: false,
            }).then(res => {
                wx.closeWindow();
            });
        } else if (this.qs.status === 'forbidden') {
            this.popupAttention = true;
        }
        waitUntil(() => {
            return !!store.state.jssdk.jssdkConfig;
        }, () => {
            /*
            * 分享
            */
            store.commit('addJSSDKReadyCallback', () => {
                const appMessage = {
                    title: _this.userInfo.appsName, // 分享标题
                    desc:  '', // 分享描述
                    link: `${location.protocol}//${location.hostname}${location.pathname}?router=location&from=sign`, // 分享链接
                    imgUrl: 'http://47.93.31.175:8080' + _this.userInfo.appsHeadUrl, // 分享图标
                };
                registerShare(appMessage);
            });
        });
    },

    mounted() {
        this.wResize()
    },
    methods: {
        wResize() {
            let originalHeight=document.documentElement.clientHeight ||document.body.clientHeight
               document.body.addEventListener('focusout', () => {
					document.body.scrollTop =  document.body.scrollHeight ;
               })
        },
        async onclickGetAuthCode() {
            if(!this.errorChecks()) return;
            if(this.getting) return;
            this.getting = true;
            let rdata, rdatas = null;
            store.commit('startRequest');
            rdata = await store.dispatch('getAutoCode', { openId: this.userInfo.openid, mobile: this.tel, });
            rdatas = await store.dispatch('getStudentMatchMobile', {mobile: this.tel});
            if (rdatas) this.studentId = rdatas ? rdatas : ''; // 绑定的学生id
            store.commit('endRequest');
            if (rdata.statusCode !== 200) {
                this.getting = false;
                return;
            } else {
                Toast(rdata.message);
            }
            let count = 59;
            this.buttonText = `60s后重新获取`;
            let timer = window.setInterval(()=> {
                this.buttonText = `${count}s后重新获取`;
                count--;
                if (count < 0) {
                    this.getting = false;
                    this.buttonText = '获取验证码';
                    clearInterval(timer);
                }
            }, 1000)
        },
        /*
        * 提交报名信息
        */
        async onclickLogin() {
            if(!this.errorChecks()) return;
            const data = {
                name: this.name,
                mobile: this.tel,
                code: this.authCode,
                openId: this.userInfo.openid,
                studentId: this.studentId,
            };
            let datas = new FormData();
            Object.keys(data).forEach(item => {
                datas.append(item, data[item]);
            });
            // console.log('[ const data ==> ]', data);
            const rdata = await store.dispatch('expenderSignUp', datas);
            if (rdata) {
                MessageBox({
                    title: '完成报名！',
                    message: '您已完成推广员报名！系统将尽快审核您的信息，请您静候佳音！',
                    showCancelButton: false,
                    closeOnClickModal: false,
                }).then(res => {
                    // window.location = this.userInfo.appsQrcodeUrl;
                    wx.closeWindow();
                });
            }
        },
        /**
         * 锚点
         */
        becomeExpand() {
            let dom = document.querySelector('.expander-sign-up')
            window.scrollTo(0, dom.offsetHeight);
        },

        /*
        * 点击确认
        */
        onclickSure() {
            this.popupAttention = false;
            wx.closeWindow();
        },
        /*
        * 错误检测
        */
        errorChecks() {
            const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (!this.name.trim()) { Toast('请输入您的姓名'); return false };
            if (!this.tel) { Toast('请输入您的手机号码'); return false };
            if (!reg.test(this.tel)) {Toast('您输入的手机号有误'); return false };
            return true;
        },
    },
};
</script>

<style lang="less" >
    .bg-gsx {
        width: 100vw;
        height: 100vh;
        position: relative;
        box-sizing: border-box;
        .expander-sign-up {
            .ban-header {
                position: relative; 
                .become {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    .xtr6(width, 154);
                    .xtr6(bottom, 20);
                    .xtr6(height, 39);
                    color: #fff;
                    .xtr6(line-height, 39);
                    text-align: center;
                    background-color: #4bb5f7;
                    outline: none;
                    border: none;
                }
                .fix {
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 555;
                }
            }
            .bg-img {
                width: 100vw;
            }
            
            >p {
                color: @888;
                text-align: left;
                .xtr6(line-height, 38);
                .xtr6(font-size, 14);
                .xtr6(padding-left, 15);
            }
            .check-container {
                .xtr6(height, 132);
                .xtr6(padding, 0, 15);
                .xtr6(margin-bottom, 46);
                p {
                    color: @000;
                    text-align: left;
                    .xtr6(font-size, 17);
                    .xtr6(height, 44);
                    .xtr6(line-height, 44);
                    i {
                        .xtr6(width, 23);
                        .xtr6(height, 23);
                        .xtr6(margin-right, 10);
                        border-radius: 50%;
                        vertical-align: middle;
                        display: inline-block;
                        box-sizing: border-box;
                        border: solid 1px #C9C9C9;
                    }
                    i.sign-select {
                        background-image: url('../assets/img/check.png');
                        background-size: 100% 100%;
                        border: none;
                    }
                }
            }
            .expander-info-container {
                z-index: 888888;
                .join-us {
                    .xtr6(margin-left, 15);
                    .xtr6(font-size, 14);
                    .xtr6(line-height, 44);
                    text-align: left;
                    color: @888;
                    border-bottom: 1px solid #DADADA;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: nowrap;
                   
                }
                .join-us1 {
                    .xtr6(padding, 10, 0, 5);
                    .xtr6(font-size, 14);
                    .xtr6(line-height, 17);
                    text-align: left;
                    color: @888;
                    // border-bottom: 1px solid #DADADA;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: nowrap;
                    .title-line {
                        display: inline-block;
                        .xtr6(width, 90);
                        .xtr6(line-height, 17);
                        .xtr6(height, 8);
                        .xtr6(margin, 0, 10);
                        border-bottom: 1px solid #E9E9E9;
                        vertical-align: bottom;
                    }
                }
                .new-table {
                    .xtr6(padding, 0, 20);
                    .line {
                        // border-bottom: 1px solid #DADADA;
                        height: 0;
                    }
                    .code {
                        display: inline-block;
                        .xtr6(width, 90);
                        .xtr6(height, 30);
                        .xtr6(line-height, 30);
                        .xtr6(margin, 5, 10);
                        text-align: center;
                        color: #fff;
                        background-color: #4BB5F7;
                        .xtr6(border-radius, 5);
                        .xtr6(font-size, 12);
                        opacity: .4;
                    }
                    li {
                        box-sizing: border-box;
                        position: relative;
                        p {
                            text-align: left;
                            .xtr6(font-size, 12);
                            .xtr6(margin, 15, 0, 10);
                            // .xtr6(margin-right, 22);
                            color: @888;
                            i {
                                color: #ff3333;
                                font-style: normal;
                                .xtr6(margin-right, 5);
                            }
                        }
                        input {
                            outline-color: invert ;
                            outline-style: none ;
                            outline-width: 0px ;
                            border: none ;
                            border-style: none ;
                            text-shadow: none ;
                            -webkit-appearance: none ;
                            -webkit-user-select: text ;
                            outline-color: transparent ;
                            box-shadow: none;
                            border: none;
                            outline: none;
                            width: 100%;
                            height: 100%;
                            .xtr6(border-radius, 5);
                            .xtr6(padding-left, 10);
                            border: 1px solid #ccc;
                            .xtr6(height, 40);
                            .xtr6(font-size, 14);
                        }
                        span {
                            position: absolute;
                            right: 0;
                            .xtr6(font-size, 16);
                            color: @proColor;
                        }
                    }
                }
                .mtb {
                    // border-top: 1px solid #DADADA;
                }
                input::-webkit-input-placeholder {
                    color: @b2;
                }
                .mb {
                    .xtr6(margin-bottom, 29)
                }
                // .xtr6(margin-top, 15);
                // ul {
                //     .xtr6(padding-left, 15);
                //     .line {
                //         border-bottom: 1px solid #DADADA;
                //         height: 0;
                //     }
                //     .code {
                //         .xtr6(padding-right, 15);
                //     }
                //     li {
                        
                //         .xtr6(height, 45);
                //         .xtr6(line-height, 45);
                //         box-sizing: border-box;
                //         .xtr6(padding-left, 92);
                //         position: relative;
                //         p {
                //             position: absolute;
                //             left: 0;
                //             // .xtr6(left, 15);
                //             top: 0;
                //             display: inline-block;
                //             .xtr6(width, 70);
                //             text-align: left;
                //             .xtr6(font-size, 17);
                //             .xtr6(margin-right, 22);
                //             color: @000;
                //         }
                //         input {
                //             border: none;
                //             outline: none;
                //             width: 100%;
                //             height: 100%;
                //             .xtr6(height, 45);
                //             .xtr6(font-size, 17);
                //         }
                //         span {
                //             position: absolute;
                //             right: 0;
                //             .xtr6(font-size, 16);
                //             color: @proColor;
                //         }
                //     }
                // }
            }
        }
        .mint-popup-box {
            border-radius: 5px;
            .popup-attention {
                .xtr6(width, 270);
                .xtr6(height, 240);
                > div {
                    box-sizing: border-box;
                    .xtr6(padding, 20, 20, 0, 20);
                    img {
                        .xtr6(width, 84);
                        .xtr6(height, 84);
                        .xtr6(margin-bottom, 22);
                    }
                    p {
                        color: @888;
                        display: inline-block;
                        width: 100%;
                        .xtr6(font-size, 15);
                        .xtr6(line-height, 23);
                        text-align: center;
                    }
                }
                button {
                    border: none;
                    outline: none;
                    color: @proColor;
                    background-color: @fff;
                    .xtr6(font-size, 18);
                    .xtr6(height, 50);
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            }
        }
    }
</style>
