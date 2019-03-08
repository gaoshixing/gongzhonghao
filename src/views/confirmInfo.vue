<template>
    <div class="confirm-info-boss">
        <div class="shop-info">
            <div class="left-gsx">
                <img :src="qs.url" alt="">
            </div>
            <div class="right-gsx">
                <p class="title">{{qs.desc}}</p>
                <span class="price">
                    ￥{{qs.price}}
                </span>
            </div>
        </div>  
        <!-- <ul class="confirm-info-ul white">
            <li v-for="(item, index) in baseInfo" :key="index">
                <mt-field :label="item.title" v-model="userInfoB[item.key]"  :placeholder="item.description" ></mt-field>
            </li>
        </ul> -->
        
        <!-- <div class="title-aro">
            <p class="confirm-title">提交以下信息，进行确认</p>
        </div> -->
        <cform
            v-if="formObj.id"
            :saveObject='saveObject'
            ref="cform"
            :formObj='formObj'
            :isOrder='true'
        >
        </cform>
        <!-- <button class="confirm-info-button" @click="onclickConfirmPay">确认</button> -->
    </div>
</template>

<script>
import store from 'store/index.js';
import cform from 'components/cform'
import {mapState} from 'vuex'
import { Field, Toast } from 'mint-ui';
import { dealQs, } from 'lib/script/hook.js';
import { hideWxOptionMenu, } from 'lib/script/util.js';

export default {
    name: 'ConfirmInfo',
    data() {
        return  {
            onOff: false,
            isFirst: true,
            qs: {
                id: '',
            },
            // baseInfo: [
            //     {title: '姓名', key: 'name', description: '请输入姓名'},
            //     {title: '手机号', key: 'phone', description: '请输入手机号'},
            // ],
            userInfoB: {
            },
            saveObject: {
                saveText: '确认',
                successEvent: this.onclickConfirmPay,
            },
            formObj: {
                id: this.qs.id,
                formId: this.qs.formIds,
            },
        }
    },

    components: {
        cform,
        Toast,
        Field,
    },

    computed: {
        ...mapState({
            openId: state => state.user.userInfo.openid,
            userInfo: state => state.user.userInfo,
        })
    },
    beforeCreate() {
        this.qs = dealQs();
        this.qs.desc = decodeURIComponent(this.qs.desc)
        this.qs.url = decodeURIComponent(this.qs.url)
    },

    async created() {
        this.qs = dealQs();
        this.qs.desc = decodeURIComponent(this.qs.desc)
        this.qs.url = decodeURIComponent(this.qs.url)
        // if (this.openId) {
        //     let obj = {
        //         openId: this.openId
        //     }
        //     const rdata = await store.dispatch('userBaseInfo', obj);
        //     this.handleD(rdata)  
        // }
        
    },
    mounted() {
        hideWxOptionMenu();
        this.wResize();
    },
    methods: {
        // handleD(rdata) {
        //     this.userInfoB = rdata.data.data
        // },

        wResize() {
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (!isiOS) return
            document.body.addEventListener('focusout', () => {
                setTimeout( () => {
                    if (!this.onOff)  {
                        document.body.scrollTop =  document.body.scrollHeight;
                        this.isFirst = true
                    }
                        this.onOff = false
                    }, 400)
            })
            document.body.addEventListener('focusin', () => {
                if (!this.isFirst) this.onOff = true
                this.isFirst = false
            })
        },

        async onclickConfirmPay() {
            // if (!/^1[34578]\d{9}$/.test(this.userInfoB.phone)) {
            //     Toast('请输入正确手机号')
            //     return 'error'
            // }
            let obj = {
                spreadId: this.qs.id,
                // clientName: this.userInfoB.name,
                // clientPhone: this.userInfoB.phone,
                openId: this.openId,
                unionId: this.userInfo.unionid,
            }
            return obj

            // if (rdata) {
            //     this.$router.push({
            //         name: 'confirmPay',
            //         query: {
            //             id: this.qs.id,
            //             price: this.qs.price,
            //         },
            //     });
            // }
        },
    },
};
</script>

<style lang="less" >
    .confirm-info-boss {
        .mint-field .mint-cell-title {
            text-align: left;
        }
        .title-aro {
            background: #fff;
            padding-left: 20px;
        }
        .confirm-title {
            color: #888;
            // .xtr6(padding-left, 20);
            .xtr6(line-height, 42);
            .xtr6(height, 42);
            .xtr6(font-size, 12);
            text-align: left;
            border-bottom: 1px solid #E5E5E5;
            background-color: #fff;
        }
        .shop-info {
            background-color: #fff;
            overflow: hidden;
            .xtr6(padding, 20, 15);
            .xtr6(height, 130);
            .xtr6(margin-bottom, 20);
            text-align: left;
            box-sizing: border-box;
            position: relative; 
            .left-gsx, .right-gsx {
                float: left;
            }
            .left-gsx {
                .xtr6(margin-right, 15);
                .xtr6(width, 90);
                .xtr6(height, 90);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .right-gsx {
                vertical-align: top;
                .xtr6(width, 231);
                .xtr6(padding-top, 5);
                .xtr6(line-height, 24);
                .xtr6(font-size, 17);
                .title {
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
            .price {
                .xtr6(font-size, 23);
                color: @attentionColor;
                position: absolute;
                .xtr6(right, 15);
                .xtr6(bottom, 20);
            }
        }
        .confirm-info-ul {
            .mint-cell-text {
                color: #000;
            }
            .mint-field-core,
            .mint-cell {
                color: inherit;
                background: transparent;
            }
            .mint-cell:last-child {
                background-image: none;
            }
            
            .mint-cell-wrapper {
                .xtr6(font-size, 17);
                padding: 0;
                .xtr6(min-height, 44);
                border: none;
                background-image: none;
            }
            li {
                position: relative;
                border-bottom: solid 1px @e5;
                .xtr6(margin-left, 15);
                .xtr6(padding-right, 15);
                .xtr6(height, 45);
                .xtr6(line-height, 45);
                p {
                    .xtr6(font-size, 14);
                    float: left;
                }
                .span-title {
                    float: right;
                    .xtr6(font-size, 14);
                }
            }
            li:nth-of-type(2){
                border-bottom: none;
                .xtr6(margin-bottom, 20)
            }
        }
    }
    .confirm-info-button {
        width: 100%;
        border: none;
        outline: none;
        color: @proColor;
        background-color: @fff;
        .xtr6(font-size, 18);
        .xtr6(height, 50);
        border-top: solid 1px @e5;
        border-bottom: solid 1px @e5;
    }
</style>
