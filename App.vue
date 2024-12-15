<script>
import Vue from 'vue'
// #ifdef  APP-PLUS
import {
  permissionListener
} from '@/common/utils/permissionTips.js';
// #endif
export default {
  onLaunch: function () {
    this.$store.commit('initApp')
    // 此地址为临时地址生产环境需更换为线上地址
    // #ifdef MP-WEIXIN
    uni.loadFontFace({
      global: true,
      family: 'fu-iconfont2',
      source: 'url("https://zhongtai.zhongbenruanjian.com/fu-iconfont2/iconfont.ttf")',
      success() {
        console.log('fu-iconfont2 字体图标加载成功  此地址为临时地址生产环境需更换为线上地址')
      },
    })
    uni.loadFontFace({
      global: true,
      family: 'cuIcon',
      source: 'url("https://zhongtai.zhongbenruanjian.com/cuIcon/cuIcon.ttf")',
      success() {
        console.log('cuIcon 字体图标加载成功  此地址为临时地址生产环境需更换为线上地址')
      },
    })
    // #endif
    uni.getSystemInfo({
      success: (e) => {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight
        let custom = wx.getMenuButtonBoundingClientRect()
        Vue.prototype.Custom = custom
        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight
        // #endif
        let unitRatio = 750 / uni.getSystemInfoSync().windowWidth
        Vue.prototype.StatusBarRpx = Vue.prototype.StatusBar * unitRatio
        Vue.prototype.CustomBarRpx = Vue.prototype.CustomBar * unitRatio
        Vue.prototype.bottomSafeArea = e.safeAreaInsets.bottom
        Vue.prototype.bottomSafeAreaRpx = e.safeAreaInsets.bottom * unitRatio
        Vue.prototype.unitRatio = unitRatio
        this.$store.commit('setSystemInfo', {
          StatusBar: Vue.prototype.StatusBar,
          CustomBar: Vue.prototype.CustomBar,
          bottomSafeArea: e.safeAreaInsets.bottom,
        })
        Vue.mixin({
          data() {
            return {
              StatusBar: Vue.prototype.StatusBar, //状态栏高度(px)
              CustomBar: Vue.prototype.CustomBar, //整个标题栏高度(px)
              StatusBarRpx: Vue.prototype.StatusBarRpx, //状态栏高度(rpx)
              CustomBarRpx: Vue.prototype.CustomBarRpx, //整个标题栏高度(rpx)
              bottomSafeArea: Vue.prototype.bottomSafeArea, //底部安全区(px)
              bottomSafeAreaRpx: Vue.prototype.bottomSafeAreaRpx, //底部安全区(rpx)
            }
          },
        })
      },
    })
    // #ifdef APP-PLUS
    //权限提示监听
    permissionListener()
    // 锁定屏幕显示方向为竖屏正方向
    plus.screen.lockOrientation('portrait-primary')
    // 推送服务
    plus.push.addEventListener('click', (message) => {
      this.pushCallback(message)
    })
    // #endif
    global.token && this.$store.dispatch('getCartList')
  },
  onShow: function () {
    console.log('APP Show')
    // #ifdef APP-PLUS
    // 获取参数
    const args = plus.runtime.arguments
    if (args) {
      plus.runtime.arguments = null
      plus.runtime.arguments = ''
      let params_str = args.split('?')[1]
      if (params_str) {
        let params = params_str.split('&').reduce(function (total, item) {
          let arr = item.split('=')
          total[arr[0]] = arr[1]
          return total
        }, {})
        console.log('params', params)
        // params 参数: path 跳转路径 options 参数
        uni.navigateTo({
          url: `${params.path}?goods_id=${params.goods_id}&activity_id=${params.activity_id}&sku_id=${params.sku_id}&bargain_id=${params.bargain_id}`,
        })
      }
    }
    // #endif
  },
  onHide: function () {
    // 用户退出app时，把二次验证状态改为true
    console.log('APP Hide')
  },
  methods: {
    // 推送回调
    pushCallback(message) {
      this.$urouter.navigateTo('/pages/service-message/message/message-type/index')
    },
    // #ifdef APP-PLUS
    // 权限检查
    checkPermissions() {
      // #ifdef APP-PLUS
      if (plus.os.name == 'Android') {
        // 判断是Android
        var main = plus.android.runtimeMainActivity()
        var pkName = main.getPackageName()
        var uid = main.getApplicationInfo().plusGetAttribute('uid')
        var NotificationManagerCompat = plus.android.importClass('android.support.v4.app.NotificationManagerCompat')
        var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled()
        // 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
        if (!areNotificationsEnabled) {
          uni.showModal({
            title: this.$t('通知权限开启提醒'),
            content: this.$t('您还没有开启通知权限，无法接受到消息通知，是否前往设置？'),
            success: function (res) {
              if (res.confirm) {
                var Intent = plus.android.importClass('android.content.Intent')
                var Build = plus.android.importClass('android.os.Build')
                //android 8.0引导
                if (Build.VERSION.SDK_INT >= 26) {
                  var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS')
                  intent.putExtra('android.provider.extra.APP_PACKAGE', pkName)
                } else if (Build.VERSION.SDK_INT >= 21) {
                  //android 5.0-7.0
                  var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS')
                  intent.putExtra('app_package', pkName)
                  intent.putExtra('app_uid', uid)
                } else {
                  //(<21)其他--跳转到该应用管理的详情页
                  intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                  var uri = Uri.fromParts('package', mainActivity.getPackageName(), null)
                  intent.setData(uri)
                }
                // 跳转到该应用的系统通知设置页
                main.startActivity(intent)
              }
            },
          })
        }
      } else if (plus.os.name == 'iOS') {
        // 判断是IOS
        var isOn = undefined
        var types = 0
        var app = plus.ios.invoke('UIApplication', 'sharedApplication')
        var settings = plus.ios.invoke(app, 'currentUserNotificationSettings')
        if (settings) {
          types = settings.plusGetAttribute('types')
          plus.ios.deleteObject(settings)
        } else {
          types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes')
        }
        plus.ios.deleteObject(app)
        isOn = 0 != types
        if (isOn == false) {
          uni.showModal({
            title: this.$t('通知权限开启提醒'),
            content: this.$t('您还没有开启通知权限，无法接受到消息通知，是否前往设置？'),
            success: function (res) {
              if (res.confirm) {
                var app = plus.ios.invoke('UIApplication', 'sharedApplication')
                var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:')
                plus.ios.invoke(app, 'openURL:', setting)
                plus.ios.deleteObject(setting)
                plus.ios.deleteObject(app)
              }
            },
          })
        }
      }
      // #endif
    },
    // #endif
  },
}
</script>

<style lang="scss">
/* #ifndef APP-PLUS-NVUE */
@import './style/main.css';
@import './style/animation.css';
@import './style/iconfont.css';
@import './style/common.scss';
@import './style/diyStyle.scss';
/* #endif */
</style>
