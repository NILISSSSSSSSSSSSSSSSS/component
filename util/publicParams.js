/**
 * 公共变量
 */

/**
 * https / http
 * @type {string}
 */
const reqHttp = window.location.protocol;

/**
 * 签名密匙signKey
 * @type {string}
 */
export const signKey = "e10adc3949ba59abbe56e057f20f883e";

/**
 * data加密密匙dataKey
 * @type {string}
 */
export const dataKey = "c33367701511b4f6020ec61ded352059";


/**
 * 七牛上传路径
 * @type {string}
 */
// export const uploadPath = "http://upload.qiniup.com/";
export const uploadPath = "//upload-z2.qiniup.com/";

/**
 * 七牛上传图片预览地址
 *
 */
// export const previewPath = "http://pc5n254yj.bkt.clouddn.com/";
// export const previewPath = "http://pe453h5rw.bkt.clouddn.com/";
export const previewPath = `${reqHttp}//gc.xksquare.com/`;


/**
 * 正则表达式
 * @type {{}}
 */
export const regex = {
    //电话
    phone: /^1\d{10}$/,
    //身份证
    idCard:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
    //银行卡
    cardNumber:/^([1-9]{1})(\d{11,18})$/,
    //密码
    password:/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/ ,
    //只能输入number类型值
    pubNumber:/^\d{1,30}$/,
    //只能输入正整数或者最多两位小数
    limitNumber:/(^[1-9]\d*$)|(^[0]{1}[\.]{1}[0-9]{1,2}$)|(^[1-9]\d*[\.]{1}[0-9]{1,2}$)/,
    //只能输入正整数
    checkInteger:/^[1-9]\d*$/g,
};

//枚举开奖方式
export const EnumJDrawType = [
    { key: 'bytime', value: '按开奖时间'},
    { key: 'bymember', value: '按开奖进度'},
    { key: 'bytime_or_bymember',value: '按开奖时间或进度'},
    { key: 'bytime_and_bymember', value: '按开奖时间和进度'}
];
//枚举返还券
export const EnumType = [
    { key: 'voucher', value: '消费券'},
    { key: 'aa_lottery', value: 'aa彩票'},
];
//枚举福利商城开奖时间类型
export const EnumWeebday = [
    { key: 'monday', value: '星期一'},
    { key: 'tuesday', value: '星期二'},
    { key: 'wednesday', value: '星期三'},
    { key: 'thursday', value: '星期四'},
    { key: 'friday', value: '星期五'},
    { key: 'saturday', value: '星期六'},
    { key: 'sunday', value: '星期日'},
    { key: 'daily', value: '日历'}
];


//枚举收益类型
export const EnumDivideCarefulType = [
    //推荐分成
    { label: '终生客户-直接分成收益', value: 'r1d' },
    { label: '终生客户-维护分成收益', value: 'r1m' },
    { label: '终生联盟商-直接分成收益', value: 'r2d' },
    { label: '终生联盟商-维护分成收益', value: 'r2m' },
    { label: '终身联盟商招募-直接分成收益', value: 'r3d' },
    { label: '终身联盟商招募-维护分成收益', value: 'r3m' },
    { label: '区域合伙人维护收益-(一级维护联盟商客户收益)-直接分成收益', value: 'rpmd1' },
    { label: '区域合伙人维护收益-(一级维护联盟商客户收益)-维护分成收益', value: 'rpmm1' },
    { label: '区域合伙人维护收益-(二级维护联盟商招募收益)-直接分成收益', value: 'rpmd2' },
    { label: '区域合伙人维护收益-(二级维护联盟商招募收益)-维护分成收益', value: 'rpmm2' },
    { label: '批发商城直推联盟商收益', value: 'wdm' },
    { label: '区域合伙人维护收益-(维护联盟商批发商城收益)-直接分成收益', value: 'wrpmd' },
    { label: '区域合伙人维护收益-(维护联盟商批发商城收益)-维护分成收益', value: 'wrpmm' },
    { label: '主播铁粉收益', value: 'ferrous' },
    { label: '（商戶）单笔销售', value: 'ss' },
    { label: '（商戶）维护收益', value: 'ms' },
    { label: '（商戶）月销售额', value: 'mms' },
    { label: '（商戶）销售补贴-购买用户', value: 'mssb' },
    { label: '（普通用戶）销售补贴-购买用户', value: 'ussb' },
    { label: '（商戶）销售补贴-区域合伙人', value: 'ssr' },
    { label: '货源奖励-推荐联盟商', value: 'sau' },
    { label: '货源奖励-推荐联盟商-补贴', value: 'saus' },
    { label: '货源奖励-维护推荐联盟商的合伙人', value: 'saup' },
    { label: '货源奖励-维护推荐联盟商的合伙人-补贴', value: 'saups' },
    { label: '普通家族收益', value: 'familyl1' },
    { label: '原始家族收益', value: 'o_familyl1' },
    { label: '钻石家族收益-工会收益', value: 'familyl2' },
    { label: '原始钻石家族收益', value: 'o_familyl2' },
    { label: '主播收益', value: 'anchor' },
    { label: '普通家族-代管主播收益', value: 'familyl1_escrow' },
    { label: '钻石家族-代管主播收益', value: 'familyl2_escrow' },
    { label: '分成舍账金额', value: 'truncation' },
    { label: '平台收入金额', value: 'platform' },
    { label: '奖池抽成金额', value: 'jackpot' },
    { label: '(商户用户)商圈订单-商家收入金额', value: 'bcircle_mr' },
    { label: '游戏订单-公司收入金额', value: 'gce' },
    { label: '礼物订单-(普通用户)收礼者所得', value: 'grp' },
    { label: '平台代管普通家族收益', value: 'ppf1' },
    { label: '平台代管砖石家族收益', value: 'ppf2' },
    { label: '(商户用户)彩票-彩票来源是商户,中奖后分得的金额', value: 'lottery_mi' }
]
