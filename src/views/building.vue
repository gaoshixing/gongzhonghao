<template>
    <div class="building-boss">
        <div>
            <img src="../assets/img/building.png" alt="">
        </div>
        <p>本地分公司公众号正在建设中 <br/>暂时不能报名</p>
    </div>
</template>

<script>
export default {
    name: 'Building',  
};
</script>

<style lang='less'>
    .building-boss {
        >div {
            .xtr6(width, 205);
            margin: 0 auto;
            .xtr6(margin-top, 156);
            img {
                width: 100%;
                .xtr6(margin-bottom, 30);
            }
            
        }
        p {
            color: @999;
            .xtr6(font-size, 16);
        }
    }
</style>

