<template>
    <div class="nav-boss">
        <ul class="nav-container white">
            <li
                v-for="(item, index) in navigations"
                :key="index"
                @click="active = item.value"
                :style="{width: width}">
                <p :class="[active === item.value ? 'nav-active' : '']">{{item.text}}</p>
            </li>
        </ul>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Nav',
    props: {
        nav: {
            type: String,
            default: '0',
        },
        navigations: {
            type: Array,
            required: true,
        },
    },
    watch: {
        active(newVal) {
            this.$emit('navChanges', newVal);
        },
    },
    data() {
        return {
            active: this.nav,
            width: 1 / this.navigations.length * 100 + '%', 
        };
    },
};
</script>

<style lang="less" >
    .nav-boss {
        position: relative;
        .nav-container {
            .xtr6(height, 47);
            .xtr6(margin-bottom, 10);
            box-sizing: border-box;
            // border-bottom: solid 1px @ddd;
            li {
                float: left;
                width: 25%;
                .xtr6(font-size, 15);
                .xtr6(height, 47);
                box-sizing: border-box;
                color: @666;
                p {
                    display: inline-block;
                    .xtr6(padding, 0, 15);
                    .xtr6(line-height, 50);
                    box-sizing: border-box;
                }
                p.nav-active {
                    color: @darkPro;
                    .xtr6(line-height, 50);
                    .xtr6(height, 47);
                    border-bottom: solid 2px @darkPro;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>