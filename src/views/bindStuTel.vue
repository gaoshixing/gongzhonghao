<template>
    <div class="login-boss">
        <div class="login-input white">
            <ul>
                <li>
                    <p>手机号码</p>
                    <input type="tel" placeholder="请输入手机号" v-model="tel">
                    <span @click="onclickGetAuthCode">{{buttonText}}</span>
                </li>
                <li>
                    <p>验证码</p>
                    <input type="number" placeholder="请输入验证码" v-model="authCode">
                </li>
            </ul>
        </div>
        <div class="button-container">
            <button
                class="button-large button-login"
                :class="[authCode ? '' : 'button-disabled', ]"
                @click="onclickToLogin">
                确认绑定
            </button>
        </div>
    </div>
</template>

<script>
import { Toast, } from 'mint-ui';
export default {
    name: 'Login',
    data() {
        return {
            aaa: false,
            getting: false, // 读秒是否结束
            buttonText: '获取验证码',
            count: 9,
            tel: '',
            authCode: '',
        };
    },
    components: {
    },
    methods: {
        /*
        * 获取验证码 及 验证
        */
        onclickGetAuthCode() {
            if (!this.verificationFunc()) return false;

            if (this.getting) {
                Toast(`请${this.count}秒后再试`);
                return;
            }

            this.buttonText = `${this.count}s后重新获取`;
            this.getting = true;
            let timer = window.setInterval(()=> {
                this.count--;
                this.buttonText = `${this.count}s后重新获取`;
                if (this.count <= 0) {
                    this.count = 9;
                    this.getting = false;
                    this.buttonText = '获取验证码';
                    clearInterval(timer);
                }
            }, 1000);
        },
        /*
        * 验证 手机号
        */
        verificationFunc() {
            const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (!reg.test(this.tel)) {
                Toast('请输入正确的手机号');
                return false;
            } else {
                return true;
            }
        },
        /*
        * 点击登录
        */
        onclickToLogin() {
            this.aaa = !this.aaa;
            if (!this.verificationFunc()) return false;
            if (!this.authCode) {
                Toast('请输入验证码');
                return false;
            }
            this.$router.push({
                name: 'taskCenter',
            });
        },
    },
};
</script>

<style lang="less" >
    .login-boss {
        height: 100%;
        overflow: hidden;
        .login-input {
            .xtr6(margin-top, 20);
            .xtr6(height, 90);
            .xtr6(padding, 0, 15);
            ul {
                li {
                    .xtr6(height, 45);
                    .xtr6(line-height, 45);
                    box-sizing: border-box;
                    .xtr6(padding-left, 92);
                    position: relative;
                    p {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: inline-block;
                        .xtr6(width, 70);
                        text-align: left;
                        .xtr6(font-size, 17);
                        .xtr6(margin-right, 22);
                        color: @000;
                    }
                    input {
                        border: none;
                        outline: none;
                        width: 100%;
                        height: 100%;
                        .xtr6(height, 45);
                        .xtr6(font-size, 17);
                    }
                    span {
                        position: absolute;
                        right: 0;
                        .xtr6(font-size, 16);
                        color: @proColor;
                    }
                }
            }
        }
    }
</style>

