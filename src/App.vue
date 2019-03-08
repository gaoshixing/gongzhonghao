<template>
	<div id="app">
		<!-- <transition name="fade" mode="out-in"> -->
		<router-view/>
		<!-- </transition> -->
		<div v-show="requesting" class="app-mt-spinner-boss">
			<div class="app-mt-spinner">
				<mt-spinner type="snake" :size=32></mt-spinner>
			</div>
		</div>
		<div class="mint-popup-global-container" v-show="popupAppGlobal" @click="onclickPopupGlobal">
			<img src="./assets/img/fx1.png" alt="">
			<img src="./assets/img/fx2.png" alt="">
		</div>
	</div>
</template>

<script>
	import { Spinner, Popup, MessageBox, } from 'mint-ui';
	import {
		mapState,
	} from 'vuex';
	import store from 'store/index.js';
	export default {
		name: 'App',
		components: {
			'mt-spinner': Spinner,
			'mt-popup': Popup,
		},
		computed: {
			...mapState({
				requesting: state => state.util.requesting,
				popupAppGlobal: state => state.util.popupAppGlobal,
			}),
		},
		methods: {
			onclickPopupGlobal() {
				store.commit('setPopupGlobal', false)
			}
		}
	};
</script>

<style lang="less">
	body {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: @bgColor;
	}
	
	div,
	a,
	img {
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
	}
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.app-mt-spinner-boss {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: transparent;
		.app-mt-spinner {
			.xtr6(width, 80);
			.xtr6(height, 80);
			background: rgba(0, 0, 0, .6);
			border-radius: 15px;
			box-sizing: border-box;
			.xtr6(padding, 20);
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
	
	#nav {
		padding: 30px;
		a {
			font-weight: bold;
			color: #2c3e50;
			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
	
	.mint-popup-global-container {
		z-index: 1;
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, .6);
		img {
			position: absolute;
		}
		img:nth-of-type(1) {
			.xtr6(width, 228);
			.xtr6(height, 111);
			.xtr6(right, 33);
			.xtr6(top, 9);
		}
		img:nth-of-type(2) {
			.xtr6(width, 263);
			.xtr6(height, 120);
			.xtr6(top, 151);
			.xtr6(left, 35);
		}
	}
	
	// .fade-enter-active,
	// .fade-leave-active {
	// 	transition: opacity 0.05s linear;
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// }
	// .fade-enter,
	// .fade-leave-active {
	// 		opacity: 0;
	// }
</style>