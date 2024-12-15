export default {
    name: 'verifyAgain',
    onShow() {
        console.log('开始二次验证', '用户token==>', this.$store.state.userInfo.user_token, '是否需要==>', this.$store.state.gestureAgain)
        // 获取当前页面的URL
        this.currentURL = this.$mp.page.route;
        // 只有再用户登录 且 需要二次验证 的情况下判断才有意义
        if (this.$store.state.userInfo.user_token && this.$store.state.gestureAgain) {
            console.log('开始判断设备...==>', uni.getSystemInfoSync().platform)
            if (uni.getSystemInfoSync().platform == "ios") {
                this.appleORan == 1;
                this.getingSupport(1);
                console.log('设备为ios')
            } else if (uni.getSystemInfoSync().platform === "android") {
                this.appleORan == 0;
                this.getingSupport(0);
                console.log('设备为安卓')
            } else {
                this.appleORan == 0;
                this.getingSupport(0);
                console.log('设备未知，默认为安卓')
            }
        }
    },
    destroyed() {
        // this.$store.commit('setGestureAgain',true);
    },
    data() {
        return {
            appleORan: null, // 判断是苹果还是安卓(苹果:1;安卓:0;)
            currentURL: null, // 获取当前页面的URL
        }
    },
    methods: {
        // 获取支持的生物监测
        getingSupport(type) {
            console.log('appleORan==3')
            let that = this;
            // #ifdef H5
            that.goingHandPassward();
            // #endif
            // #ifndef H5
            uni.checkIsSupportSoterAuthentication({
                success(res) {
                    // console.log("获取支持的生物监测成功==>", res.supportMode.indexOf("facial") != -1,that.appleORan == 1);
                    // 如果支持人脸识别，就优先人脸识别,否则就去指纹识别(人脸识别还需要判断是否是ios设备，如果不是，直接指纹。)
                    if (res.supportMode.indexOf("facial") != -1 && type == 1) {
                        console.log('进入人脸识别')
                        that.examineFaceID();
                    } else if (res.supportMode.indexOf("fingerPrint") != -1) {
                        console.log('进入指纹识别')
                        that.examineFingetprint();
                    } else {
                        that.goingHandPassward();
                    }
                },
                fail(err) {
                    console.log("获取支持的生物监测失败==>", err);
                    that.goingHandPassward();
                },
            });
            // #endif
        },
        // 手势密码入口
        goingHandPassward() {
            // 如果保存的有密码那就是解锁模式，如果没有那就是设置模式
            if (this.$store.state.userInfo.hand_password == '') {
                console.log('跳转到设置手势密码')
                uni.showToast({
                    title: this.$t('请先设置你的密码'),
                    duration: 500,
                    icon: 'none'
                });
                this.$urouter.redirectTo({
                    url: '/pages/index/setting/gesturePassword',
                    params: {
                        "type": 2,
                    }
                })
            } else {
                console.log('跳转到手势密码')
                // 跳转到手势密码的页面时也到带上当前的页面路径
                this.$urouter.redirectTo({
                    url: '/pages/index/setting/gesturePassword',
                    params: {
                        "type": 1,
                        "currentURL": this.currentURL
                    }
                })
            }
        },
        // 检查是否录入指纹
        examineFingetprint() {
            let that = this;
            uni.checkIsSoterEnrolledInDevice({
                checkAuthMode: "fingerPrint",
                success(res) {
                    console.log("检查是否录入指纹==>", res);
                    // 如果没有录入指纹就跳转到设备的设置页面（不过应该用不到）
                    if (res.isEnrolled) {
                        that.startFingerprint();
                    }
                },
                fail(err) {
                    console.log(err);
                },
            });
        },
        // 检查是否录入faceID
        examineFaceID() {
            let that = this;
            uni.checkIsSoterEnrolledInDevice({
                checkAuthMode: "facial",
                success(res) {
                    console.log("检查是否录入faceID", res);
                    // 检查是否录入人脸
                    if (res.isEnrolled) {
                        that.startFaceID();
                    }
                },
                fail(err) {
                    console.log(err);
                },
            });
        },
        // 开始指纹识别
        startFingerprint() {
            let that = this;
            uni.startSoterAuthentication({
                requestAuthModes: ["fingerPrint"],
                challenge: this.$t("要携带的参数"),
                authContent: this.$t("请用指纹解锁"),
                success(res) {
                    that.$store.commit('setGestureAgain', false);
                    console.log("指纹识别成功==>", res);
                    // 如果识别成功就
                    uni.showToast({
                        title: this.$t("识别成功"),
                        duration: 500,
                    });
                },
                fail(err) {
                    console.log(err);
                    uni.showToast({
                        title: this.$t('验证失败'),
                        duration: 1000,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        that.$urouter.navigateBack()
                    }, 1000)
                },
            });
        },
        // 开始人脸识别
        startFaceID() {
            let that = this;
            uni.startSoterAuthentication({
                requestAuthModes: ["facial"],
                challenge: this.$t("要携带的参数"),
                authContent: this.$t("请用FaceID解锁"),
                success(res) {
                    console.log("人脸识别成功==>", res);
                    that.$store.commit('setGestureAgain', false);
                    // 如果识别成功就
                    uni.showToast({
                        title: this.$t("识别成功"),
                        duration: 500,
                    });
                },
                fail(err) {
                    console.log(err);
                    uni.showToast({
                        title: this.$t('验证失败'),
                        duration: 1000,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        that.$urouter.navigateBack()
                    }, 1000)
                },
            });
        },
    },
};
