import {
  API_VERSION,
  PAAS_URL
} from '@/common/config.js';
const publicApi = {
  postRecommentGoods: `/${API_VERSION}/5fd9a32379116`, //智能推荐
  numberOfShoppingCart: ``,//获取购物车数量
  publicUpdateAPP: `/${API_VERSION}/6423fb49bc82c`, // 静默更新
  queryAutograph: `/v1/6454d9663e508`, // 获取oss配置接口
  UPLOAD_IMAGE_URL: `/${API_VERSION}/5d5fa8984f0c2`, // 本地图片上传接口
  // UPLOAD_FILE_URL: `/${API_VERSION}/5d5fa8984f0c2`, // 文件上传接口
  GetVerifyCode: `/${API_VERSION}/5b5bdc44796e8`, // 发送验证码
  getVerifyCodeNew: `/${API_VERSION}/666a45d4d6bb4`, //新版验证码
  beforeGetVerifyCodeNew: `/${API_VERSION}/6668f5d1d434e`, // 新版验证码前置接口
  post5c78c4772da97:`/${API_VERSION}/5c78c4772da97`, //个人中心-获取会员详细信息
post636de668c7eb0:`/${API_VERSION}/636de668c7eb0`, //用户管理-会员当前等级详情
post64254d2ad5999:`/${API_VERSION}/64254d2ad5999`, //钱包-获取分享赚/自购返累计金额（我的）
post644ceb577e29e:`/${API_VERSION}/644ceb577e29e`, //订单-获取订单角标
post64897f6fd5486:`/${API_VERSION}/64897f6fd5486`, //客服-获取聊天连接
post63732dbecbc14:`/${API_VERSION}/63732dbecbc14`, //商家入驻-查看入驻状态(2023-0316)
post64241ca6cf066:`/${API_VERSION}/64241ca6cf066`, //系统消息-获取未读消息角标
post64184ac1cafc3:`/${API_VERSION}/64184ac1cafc3`, //商品管理-商品列表
post641e88b843d57:`/${API_VERSION}/641e88b843d57`, //商品搜索-获取店铺列表
post63e36c4963fb8:`/${API_VERSION}/63e36c4963fb8`, //商品管理-获取品牌列表
post641568f1b6f87:`/${API_VERSION}/641568f1b6f87`, //系统文章--获取系统单页内容
post5cad9f63e4f94:`/${API_VERSION}/5cad9f63e4f94`, //登录注册-会员注册
post5caeeba9866aa:`/${API_VERSION}/5caeeba9866aa`, //登录注册-重置密码（忘记密码）
post5cb54af125f1c:`/${API_VERSION}/5cb54af125f1c`, //设置中心-修改用户资料
post64219c5dc8d0d:`/${API_VERSION}/64219c5dc8d0d`, //文章列表-获取文章详情
post6421a00e4fa4e:`/${API_VERSION}/6421a00e4fa4e`, //文章管理-获取文章列表（以分类分组）
post641472eb35317:`/${API_VERSION}/641472eb35317`, //用户管理-意见反馈记录
post6414719bdc956:`/${API_VERSION}/6414719bdc956`, //用户管理-意见反馈类型
post6414724b96f3f:`/${API_VERSION}/6414724b96f3f`, //用户管理-意见反馈提交
post637c4deb97aa9:`/${API_VERSION}/637c4deb97aa9`, //注销账号-注销详情
post637c4d70d3aa8:`/${API_VERSION}/637c4d70d3aa8`, //注销账号-发起注销
post637c458b131e3:`/${API_VERSION}/637c458b131e3`, //注销账号-注销账号原因
post5f6c915d69d1f:`/${API_VERSION}/5f6c915d69d1f`, //设置中心-修改手机号
post5da9ab4c4c7af:`/${API_VERSION}/5da9ab4c4c7af`, //设置中心-用旧密码重置密码
post64534cbb2c352:`/${API_VERSION}/64534cbb2c352`, //系统配置-获取系统配置参数
post641576c24de11:`/${API_VERSION}/641576c24de11`, //系统文章-获取公告详情
}
const pageFiles = require.context('../../pages/', true, /\api.js$/);
const pageApis = pageFiles.keys().reduce((modules, modulePath) => {
  const value = pageFiles(modulePath);
  if ((typeof value == 'object') && value.default) {
    Object.assign(modules, value.default);
  }
  return modules;
}, publicApi);
const modulesFiles = require.context('../../components/', true, /\api.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath);
  if ((typeof value == 'object') && value.default) {
    Object.assign(modules, value.default);
  }
  return modules;
}, pageApis);

export default modules;
/**
 * 如果是第一套代码,删掉下面的对象即可
 * 如果不是第一套代码,导出下面的对象即可
 * 如果哪一套的代码都有,下面的对象合并到上面的对象即可
 * */
const del = {}
