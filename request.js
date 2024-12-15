import { navigateToLogin } from '@/common/utils/utils.js';
import store from '@/store/index';
import { dev_host, mock_host, product_host, needProductUrl } from '../config.js';
export default class Request {
  config = {
    baseUrl: '',
    header: { 'Content-Type': 'application/json; charset=utf-8', },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success() { },
    fail() { },
    complete() { }
  }
  static posUrl(url) { /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }
  interceptor = {
    request: (f) => {
      if (f) {
        this.requestBeforeFun = f
      }
    },
    response: (f) => {
      if (f) {
        this.requestComFun = f
      }
    }
  }
  static requestBeforeFun(config) {
    return config
  }
  static requestComFun(response) {
    return response
  }
  static requestInstance = null
  setConfig(f) {
    this.config = f(this.config)
    return this
  }
  testNeedProductUrl(url) {
    return needProductUrl.findIndex(ele => ele == url) != -1;
  }
  request(options = {}, requestType) {
    if (options.url == undefined) return Promise.reject();
    let afC = { ...this.config, data: {} }
    if (this.testNeedProductUrl(options.url)) {
      options.baseUrl = product_host + '/api';
    } else {
      options.baseUrl = options.baseUrl || this.config.baseUrl;
    }
    if (options.dataType) afC.dataType = options.dataType;
    if (options.url) afC.url = Request.posUrl(options.url) ? options.url : (options.baseUrl + options.url);
    if (options.data) afC.data = options.data
    if (options.method) afC.method = options.method

    return new Promise((resolve, reject) => {
      let next = true
      let _config = null
      afC.complete = (response) => {
        if (requestType == 1) {
          setTimeout(() => {
            console.log('请求结束');
            Request.requestInstance = null
          }, 1000);
        }
        if (requestType == 2) {
          Request.requestInstance = null
        }
        if (response.errMsg == 'request:fail abort') {
          reject(response.errMsg)
          return
        }
        let statusCode = response.statusCode
        response.config = _config
        response = this.requestComFun(response)
        if (statusCode != 200) {
          let errMessage = '';
          switch (statusCode) {
            case 400:
              errMessage = global.i18n.t('请求错误(400)');
              break;
            case 401:
              errMessage = global.i18n.t('未授权，请重新登录(401)');
              uni.showToast({
                title: global.i18n.t('登录失效'),
                icon: 'none',
                position: 'bottom',
                duration: 1500
              })
              store.commit('logout');
              break;
            case 403:
              errMessage = global.i18n.t('拒绝访问(403)');
              break;
            case 404:
              errMessage = global.i18n.t('请求出错(404)');
              break;
            case 408:
              errMessage = global.i18n.t('请求超时(408)');
              break;
            case 500:
              errMessage = global.i18n.t('服务器错误(500)');
              break;
            case 501:
              errMessage = global.i18n.t('服务未实现(501)');
              break;
            case 502:
              errMessage = global.i18n.t('网络错误(502)');
              break;
            case 503:
              errMessage = global.i18n.t('服务不可用(503)');
              break;
            case 504:
              errMessage = global.i18n.t('网络超时(504)');
              break;
            case 505:
              errMessage = global.i18n.t('HTTP版本不受支持(505)');
              break;
            default:
              errMessage = global.i18n.t("服务器错误!");
              break;
          }
          if (statusCode != 401) {
            uni.showToast({
              title: errMessage,
              icon: 'none',
              position: 'bottom',
              duration: 1500
            })
            uni.$emit('netWorkError', { msg: global.i18n.t('服务器太拥挤了~请您稍后重试') })
          }
          reject({ statusCode, errMessage })
          uni.stopPullDownRefresh();
          return
        }
        let _code = response.data.code;
        if (_code == '-201' || _code == '-202' || _code == '-203') {
          uni.showToast({
            title: global.i18n.t('登录失效，请重新登录'),
            icon: 'none',
          })
          store.commit("logout");
          navigateToLogin();
        } else {
          resolve(response)
        }
        uni.stopPullDownRefresh();
      }
      let cancel = (t = 'handle cancel') => {
        let err = {
          errMsg: t,
          config: afC
        }
        reject(err)
        next = false
      }
      // #ifdef MP-WEIXIN
      // 优化小程序请求字段undefined问题
      if (afC.data) {
        Object.keys(afC.data).map(key => {
          if (afC.data[key] === undefined) afC.data[key] = ''
        })
      }
      // #endif
      _config = this.requestBeforeFun(afC, cancel)
      if (options.header) _config.header = { ...this.config.header, ...options.header }
      if (!next) return
      if (requestType) {
        Request.requestInstance = uni.request(_config)
      } else {
        uni.request(_config)
      }
    })
  }
  get(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }
  post(url, data, options = {},) {
    options.url = url
    options.data = data
    options.method = 'POST'

    return this.request(options)
  }
  // 防连点请求
  dbGet(url, data, options = {},) {
    options.url = url
    options.data = data
    options.method = 'GET'
    if (Request.requestInstance) return Promise.resolve(false)
    return this.request(options, 1)
  }
  // 防连点请求
  dbPost(url, data, options = {},) {
    options.url = url
    options.data = data
    options.method = 'POST'
    if (Request.requestInstance) return Promise.resolve(false)
    return this.request(options, 1)
  }
  //可取消请求
  aGet(url, data, options = {},) {
    options.url = url
    options.data = data
    options.method = 'GET'
    if (Request.requestInstance?.abort) Request.requestInstance.abort()
    return this.request(options, 2)
  }
  //可取消请求
  aPost(url, data, options = {},) {
    options.url = url
    options.data = data
    options.method = 'POST'
    if (Request.requestInstance?.abort) Request.requestInstance.abort()
    return this.request(options, 2)
  }
}
