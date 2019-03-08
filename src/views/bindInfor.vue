
<style lang='less'>
    .bind-infor-Gsx {
        position: absolute;
        box-sizing: border-box;
         .xtr6(bottom, 0);
        .xtr6(left, 0);
        .xtr6(top, 0);
        .xtr6(right, 0);
        .bind-title {
            // .xtr6(margin-top, 30);
        }
        .phone-number {
            .xtr6(margin, 30, 0);
        }
        .bind-button {
            position: absolute;
            .xtr6(bottom, 0);
            .xtr6(left, 0);
        }
    }

</style>
<template>
    <div class="bind-infor-Gsx">
        <!-- <p class="bind-title">绑定手机号</p> -->
        <mt-field label="手机号" v-model="phoneNumber" class="phone-number" placeholder="请输入手机号" type="tel" ></mt-field>
        <button class="button-large bind-button" @click="bindPhone" type="primary">绑定</button>
    </div>
</template>

<script>
import { Popup, Button, Field, Toast } from 'mint-ui';
import store from 'store/index.js';
import { mapState, } from 'vuex';
import { dealQs, } from 'lib/script/hook.js';


export default {
    data() {
        return {
            phoneNumber: '',
            qs: '',
        }
    },

    mounted() {
        this.qs = dealQs();
        if (this.qs.status && this.qs.status != 'false') {
            Toast({
                message: '您已经绑定过手机号',
                position: 'middle',
                duration: 800
            });
            setTimeout(() => {
                wx.closeWindow()
            }, 800)
        }
        // this.bindPhoneNumber()
    },

    methods: {
        async bindPhone() {
            let params = new FormData()
            params.append('phone', this.phoneNumber)
            let data = await store.dispatch('bindPhoneNumber', params)
            Toast({
                message: '绑定成功',
                position: 'middle',
                duration: 800
            });
            setTimeout(() => {
                wx.closeWindow()
            }, 800)
        },
    }
}
</script>
