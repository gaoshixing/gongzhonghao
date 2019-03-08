<template>
    <div class="personal-center-boss">
        <ul class="personal-center-ul white">
            <li>
               <p>头像</p>
               <img :src="userInfo && userInfo.avatarUrl" alt="">
               <!-- <i class="arrow-class"></i> -->
            </li>
            <li>
                <p>姓名</p>
                <span>{{userInfo && userInfo.name}}</span>
                <!-- <i class="arrow-class"></i> -->
            </li>
            <li>
                <p>手机号</p>
                <span>{{userInfo && userInfo.phone | telFilter}}</span>
                <!-- <i class="arrow-class"></i> -->
            </li>
        </ul>
        <Tabbar :value="value"></Tabbar>
    </div>
</template>
<script>
import store from 'store/index.js';
import Tabbar from 'components/tabbar.vue';
import { mapState, } from 'vuex';
import { hideWxOptionMenu, } from 'lib/script/util.js';

export default {
    name: 'PersonalCenter',
    components: {
        Tabbar,
    },
    data() {
        return {
            value: '2',
            over: false,
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
        }),
    },
    filters: {
        telFilter(v) {
            if (!v) return v;
            v = v.split('');
            v.splice(3, 0, '-');
            v.splice(8, 0, '-');
            return v.join('').replace(/-/g, '\t');
        },
    },
    mounted() {
        hideWxOptionMenu();
    },
};
</script>
<style lang="less" >
    .personal-center-boss {
        max-height: 100vh;
        .xtr6(padding-top, 15);
        background-color: @bgColor;
        box-sizing: border-box;
        .xtr6(margin-bottom, 55);
        .personal-center-ul {
            border-top: solid .5px #DADADA;
            border-bottom: solid .5px #DADADA;
            li {
                position: relative;
                .xtr6(margin-left, 15);
                .xtr6(padding-right, 15);
                // .xtr6(padding-right, 38);
                p {
                    color: @333;
                    .xtr6(font-size, 18);
                    float: left;
                }
                span {
                    float: right;
                    color: @999;
                    .xtr6(font-size, 17);
                }
                img {
                    float: right;
                    .xtr6(width, 72);
                    .xtr6(height, 72);
                    .xtr6(padding-top, 10);
                    border-radius: 50%;
                }
            }
            li {
                .xtr6(height, 44);
                .xtr6(line-height, 44);
            } 
            li:nth-of-type(1) {
                .xtr6(height, 92);
                .xtr6(line-height, 92);
                border-bottom: solid .5px @e5;
            }
            li:nth-of-type(2) {
                border-bottom: solid .5px @e5;
            }
        }
    }
</style>

