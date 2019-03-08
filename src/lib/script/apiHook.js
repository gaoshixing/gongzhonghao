import { MessageBox, } from 'mint-ui';
export default class AxiosHooks {
	constructor(axios47, wxAxios, schoolAxios, crmAxios) {
		this.axios47 = axios47;
		this.wxAxios = wxAxios;
		this.schoolAxios = schoolAxios;
		this.crmAxios = crmAxios;
		this.init();
	};
	init() {
		this.axios47.interceptors.response.use(response => {
			return this.dealResponse(response);
		}, function (error) {
			return Promise.reject(error);
		});

		this.wxAxios.interceptors.response.use(response => {
			return this.dealResponse(response);
		}, function (error) {
			return Promise.reject(error);
		});

		this.schoolAxios.interceptors.response.use(response => {
			return this.dealResponse(response);
		}, function (error) {
			return Promise.reject(error);
		});

		this.crmAxios.interceptors.response.use(response => {
			return this.dealResponse(response);
		}, function (error) {
			return Promise.reject(error);
		});
	};
	dealResponse(response) {
		if (response.status === 503) {
			Toast('系统异常,请稍后再试');
			store.commit('endRequest');
		} else if (response.data.statusCode === 403) {
			MessageBox({
				title: '温馨提示',
				message: response.data.message,
				showCancelButton: false,
			}).then(res => {
				wx.closeWindow();
			});
		} else if (response.data.statusCode === 0) {
			MessageBox({
				title: '温馨提示',
				message: response.data.message,
				showCancelButton: false,
			}).then(res => {
				wx.closeWindow();
			});
		}else if (response.data.statusCode === 100) {
			MessageBox({
				title: '温馨提示',
				message: response.data.message,
				showCancelButton: false,
			}).then(res => {
				// wx.closeWindow();
			});
		}
		return response;
	};
};