<template>
    <div class="tabbar-boss">
        <mt-tabbar v-model="select" :fixed="fixed" class="fix-iphonex">
            <mt-tab-item id="0">
                <img slot="icon" src="../assets/img/task.png" v-if="select !== '0'" class="tabbar-img-1">
                <img slot="icon" src="../assets/img/task-ac.png" v-if="select === '0'" class="tabbar-img-1">
                任务中心
            </mt-tab-item>
            <mt-tab-item id="1">
                <img slot="icon" src="../assets/img/money.png" v-if="select !== '1'" class="tabbar-img-2">
                <img slot="icon" src="../assets/img/money-ac.png" v-if="select === '1'" class="tabbar-img-2">
                推广返利
            </mt-tab-item>
            <mt-tab-item id="2">
                <img slot="icon" src="../assets/img/mine.png" v-if="select !== '2'" class="tabbar-img-3">
                <img slot="icon" src="../assets/img/mine-ac.png" v-if="select === '2'" class="tabbar-img-3">
                个人中心
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabItem } from 'mint-ui';
export default {
    name: 'Tabbar',
    components: {
        'mt-tabbar': Tabbar,
        'mt-tab-item': TabItem,
    },
    props: {
        value: {
            type: String,
            default: '0',
        },
        fixed: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            select: this.value,
        };
    },
    watch: {
        select(newVal) {
            switch(newVal) {
                case '0': this.$router.push({  name: 'taskCenter', }); break;
                case '1': this.$router.push({  name: 'expandWeal', }); break;
                case '2': this.$router.push({  name: 'personalCenter', }); break;
            };
        },
    },
};
</script>

<style lang="less" >
    .tabbar-boss {
        position: fixed;
        bottom: 0;
        left: 0;
        .xtr6(height, 50);
        .tabbar-img-1 {
            .xtr6(width, 18);
            .xtr6(height, 18);
            margin: 0 auto;
            .xtr6(margin-top, 2);
        }
        .tabbar-img-2 {
            .xtr6(width, 22);
            .xtr6(height, 20);
            margin: 0 auto;
        }
        .tabbar-img-3 {
            .xtr6(width, 20);
            .xtr6(height, 19);
            margin: 0 auto;
            .xtr6(margin-top, 1);
        }
    }
    .mint-tabbar {
        background: @fff;
        border-top: solid .5px @ddd;
        .xtr6(height, 50);
        .mint-tab-item-icon {
            .xtr6(width, 22);
            .xtr6(height, 22);
        }
        .is-selected {
            background-color: @fff !important;
            .mint-tab-item-label {
                color: @proColor !important;
            }
        }
    }
</style>
