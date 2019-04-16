/**
 * Created by choizhang on 2018/1/31.
 */
import Vue from 'vue';
import Moment from 'moment';
import math from '@/util/math.js'

Vue.filter('formatTime', (time, type) => {
    if (time == undefined) {
        return "";
    }
    //如果是一个时间段，则取第一个
    if (String(time).indexOf("-") > 0) {
        time = time.split('-')[0];
    }
    time = Number(time) < 10000000000 ? time * 1000 : Number(time);
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
});

Vue.filter('formatSize', (bytes) => {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
});

Vue.filter('decodeURI', (url) => {
    if (url) {
        return decodeURIComponent(url)
    }
    return "";
})

Vue.filter('formatPrice', (value) => {
    if (value && value > 0) {
        return Number(value).toFixed(2);
    } else {
        return "0.00";
    }
})

//
Vue.filter('isSelf', (value) => {
    if (value == 1) {
        return "不独立"
    }
    if (value == 0) {
        return "独立";
    } else {
        return "";
    }
})

Vue.filter('shopType', (value) => {
    if (value == "MASTER") {
        return "总店"
    }
    if (value == "BRANCH") {
        return "分店"
    }
    if (value == "SHOP_IN_SHOP") {
        return "店中店"
    } else {
        return "";
    }

})
Vue.filter('authStatus', (value) => {
    if (value == "SUBMIT") {
        return "已提交"
    }
    if (value == "SUCCESS") {
        return "审核成功"
    }
    if (value == "FAILED") {
        return "审核失败"
    }
    if (value == "REVOKE") {
        return "已撤销"
    } else {
        return "无";
    }
})

//商品上下架状态
Vue.filter('goodsStatus', (value) => {
    if (value == 'UP') {
        return "上架"
    }
    if (value == 'DOWN') {
        return "下架"
    }
    if (value == 'SYS_DOWN') {
        return "系统下架"
    } else {
        return "";
    }
})

//商品审核状态
Vue.filter('auditStatus', (value) => {
    if (value == 'UNAUDITED') {
        return "未审核"
    }
    if (value == 'UNAPPROVED') {
        return "未审核通过"
    }
    if (value == 'VERIFIED') {
        return "审核通过"
    }
    if (value == 'OTHER') {
        return "其它"
    } else {
        return "";
    }
})

//商品类型
Vue.filter('goodsTypeId', (value) => {
    if (value == '1001') {
        return "服务类"
    }
    if (value == '1002') {
        return "商品类"
    }
    if (value == '1003') {
        return "住宿类"
    }
    if (value == '1004') {
        return "外卖类"
    }
    if (value == '1005') {
        return "在线购物"
    }
    else {
        return "";
    }
})

//退款类型
Vue.filter('refunds', (value) => {
    if (value === '0') {
        return "CONSUME_BEFORE"
    }
    if (value == '1') {
        return "RESERVATION_BEFORE_BYTIME"
    }
    if (value == '2') {
        return "RESERVATION_BEFORE"
    }
    if (value == '3') {
        return "NOT_REFUNFS"
    } else {
        return "";
    }
})

//商户财务中心（审核状态）
Vue.filter('cashWithdrawalAudit', (value) => {
    if (value === 'UNAUDITED') {
        return "未审核"
    }
    if (value == 'UNAPPROVED') {
        return "未审核通过"
    }
    if (value == 'VERIFIED') {
        return "提现中"
    }
    if (value == 'FINISH') {
        return "提现成功"
    }
    if (value == 'UN_FINISH') {
        return "提现失败"
    }
    else {
        return "";
    }
})

Vue.filter('onLine', (value) => {
    if (value === 1) {
        return "上线"
    }
    if (value == 0) {
        return "下线"
    } else {
        return "";
    }
})

Vue.filter('filterWeekday', (value) => {
    let weekList = { "mon": "星期一", "tue": "星期二", "wed": "星期三", "thu": "星期四", "fri": "星期五", "sat": "星期六", "sun": "星期天" };
    return weekList[value] ? weekList[value] : ""
})

// 订单相关
const orderstatus = {
    "STAY_ORDER": "待接单", "STAY_PAY": "待付款", "STAY_CONSUMPTION": "待消费", "STOCK_CENTRE": "备货中", "STAY_CLEARING": "进行中", "AGREE_PAY": "同意支付", "CONSUMPTION_CENTRE": "进行中", "PROCESS_CENTRE": "进行中", "SHOP_DELIVERY": "已送达", "STAY_EVALUATE": "待评价", "COMPLETELY": "已完成或者已关闭",
}
Vue.filter('orderStatus', (value) => {
    return orderstatus[value] ? orderstatus[value] : ""
})

//骑手状态
let riderStatusBox = {
    "wait_rider": "等待骑手接单", "wait_pickup": "等待骑手取货", "rider_drivering": "骑手配送中", "rider_refuse": "骑手拒单", "rider_trans": "已转单", "rider_transing": "转单中",
    "rider_arraive": "订单已完成", "order_cancel": "订单已取消", "order_canceling": "订单取消中", "user_confirm": "用户收货"
}

Vue.filter('riderStatus', (value) => {
    return riderStatusBox[value] ? riderStatusBox[value] : ""
})



Vue.filter('isShangMen', (value) => {
    switch (value) {
        case 1:
            return "到店取货";
        case 0:
            return "外卖上门";
        default:
            return ""
    }
})

Vue.filter('MUserType', (value) => {
    if (value === 'SHOPEMPLOYEE' || value == 'SHOPKEEPER') {
        return "店铺员工"
    }
    if (value == 'NORMALEMPLOYEE') {
        return "普通员工"
    }
})

let payStatusBox = {
    "NOT_PAY": "未支付", "DURING_PAY": "支付中", "SUCCESS_PAY": "支付成功", "APPLY_REFUND": "申请退款中", "AGREE_REFUND": "同意退款 ", "REFUSE_REFUND": "拒绝退款", "SUCCESS_REFUND": "退款成功 ",
    "FAILED_PAY": "支付失败",
}
Vue.filter('payStatus', (value) => {
    return payStatusBox[value] ? payStatusBox[value] : ""
})

let auditStatusBox = {
    "UNAUDITED": "未审核", "UNAPPROVED": "未通过", "VERIFIED": "已通过", "OTHER": "其他"
}

Vue.filter('audiStatus', (value) => {
    return auditStatusBox[value] ? auditStatusBox[value] : ""
})

Vue.filter('PermissionType', (value) => {
    if (value === 'MERCHANT') {
        return "联盟商权限"
    }
    if (value == 'SHOP') {
        return "店铺权限"
    }
    if (value == 'CUSTOMER') {
        return "客服权限"
    }
    if (value == 'OTHER') {
        return "其他权限"
    }
})

//------------------财务中心------------------
Vue.filter('financePayStatus', (value) => {
    if (value === 'notPay') {
        return "未支付"
    }
    if (value == 'free') {
        return "免加盟金"
    }
    if (value == 'freeze') {
        return "已提取保证金"
    }
    if (value == 'paySuccess') {
        return "已缴纳保证金"
    }
})

//---------------入驻相关的-------------------
Vue.filter('MerchantType', (type) => {
    switch (type) {
        case 'personal':
            return "个人";
        case 'anchor':
            return "主播";
        case 'shops':
            return "商户";
        case 'company':
            return "合伙人";
        case 'familyL1':
            return "家族长";
        case 'familyL2':
            return "公会";
        default:
            break;
    }
});
//运费设置类型
Vue.filter('valuateTypes', (value) => {
    if (value === 'BY_NUMBER') {
        return "按数量"
    }
    if (value == 'BY_WEIGHT') {
        return "按重量"
    }
    if (value == 'DISTANCE') {
        return "按距离"
    }
});
//性别
Vue.filter('sexType', (value) => {
    if (value === 'male') {
        return "男"
    }
    if (value == 'female') {
        return "女 "
    }
    if (value == 'unknown') {
        return "保密"
    }
});

// ------------------任务中心相关--------------------
//商户身份
let merchantType2List = {
    "personal": "个人", "anchor": "主播", "shops": "商户", "company": "合伙人", "familyL1": "家族长", "familyL2": "公会"
}

Vue.filter('merchantType2', (value) => {
    if (!value || value == undefined) {
        return "";
    }
    return merchantType2List[value] && merchantType2List[value] !== undefined ? merchantType2List[value] : ""
})

//任务列表和审核列表不能用这个状态
let alTasklStatusList = {
    "un_do": "未完成", "did": "审核中", "re_do": "审核失败", "un_check": "未验收", "check_fail": "验收失败", "check_success": "验收成功", "sys_audit_success": "已完成", "un_audit": "未审核", "audit_fail": "审核失败", "audit_success": "审核成功",
}
Vue.filter('AllTaskStatus', (value) => {
    return alTasklStatusList[value] ? alTasklStatusList[value] : "无"
})


let JobTypeList = {
    "join": "联盟商入驻任务", "train": "联盟商培训任务",
}
Vue.filter('jobType', (value) => {
    return JobTypeList[value] ? JobTypeList[value] : "无"
})

Vue.filter('step', (value) => {
    if (value === 0) {
        return "联盟商入驻"
    }
    if (value > 0) {
        return "联盟商入驻培训任务"
    } else {
        return "";
    }
})
//------------------ --------------------家族相关----------------------
Vue.filter('fineSource', (value) => {
    if (value === "shop") {
        return "商户"
    }
    if (value == "gift") {
        return "礼物"
    } else {
        return "";
    }
})
Vue.filter('fineType', (value) => {
    if (value === "lock_drawout") {
        return "锁定分成"
    }
    if (value == "frozen_account") {
        return "冻结账户"
    } if (value == "ratio_amount") {
        return "比例罚款"
    }
    if (value == "fix_amount") {
        return "固定罚款"
    }
})

const ruleNameList = {
    sale_total_amount: "销售总额", active_user: "活跃用户数", rd_users: "推荐用户数", rd_merchants: "推荐商户数",
    refuse_order: "拒单数", turnover: "成交额", qualified_merchant: "合规商户数", rd_goods: "推荐商品成交额", gift_amount: "礼物金额", zhubo_number: "主播人数", live_time: "直播时长"
    , vedio_publish: "小视频发布数"
}
Vue.filter('ruleName', (value) => {
    return ruleNameList[value] ? ruleNameList[value] : ""
})

Vue.filter('rule', (value) => {
    if (value === "gt") {
        return "大于"
    }
    if (value === "lt") {
        return "小于"
    }
})
Vue.filter('status', (value) => {
    if (value === "active") {
        return "正常"
    }
    if (value === "disabled") {
        return "冻结"
    }
    if (value === "del") {
        return "删除"
    }
})

let inStatusList = { apply: "申请加入", refuse: "拒绝加入", agree: "同意加入", platform: "平台介入退出" }
Vue.filter('inStatus', (value) => {
    return inStatusList[value] ? inStatusList[value] : ""
})

let outStatusList = { apply: "申请退出", refuse: "拒绝退出", agree: "同意退出", platform: "平台介入退出" }
Vue.filter('outStatus', (value) => {
    return outStatusList[value] ? outStatusList[value] : ""
})



let recommendStatusList = { NO: "不推荐", A: "A级推荐", B: "B级推荐", C: "C级推荐" }
Vue.filter('recommendStatus', (value) => {
    return recommendStatusList[value] ? recommendStatusList[value] : "无"
})

let applyStatusList = { APPLY_JOIN: "申请加入", REFUSE_JOIN: "拒绝加入", AGREE_JOIN: "同意加入", APPLY_QUIT: "申请退出", REFUSE_QUIT: "拒绝退出", AGREE_QUIT: "同意退出" }
Vue.filter('status2', (value) => {
    return applyStatusList[value] ? applyStatusList[value] : ""
})

// 会员卡和优惠券相关
Vue.filter("couponStatus", (value) => {
    if (value === "UNUSED") {
        return "未使用"
    }
    if (value === "INUSE") {
        return "使用中"
    }
    if (value === "USED") {
        return "已使用"
    } else {
        return "";
    }
})


Vue.filter("couponScope", (value) => {
    if (value === "GOODS") {
        return "单品"
    }
    if (value === "ALL") {
        return "全场"
    }
    if (value === "CATEGORY") {
        return "品类"
    } else {
        return "";
    }
})



Vue.filter("cardType", (value) => {
    if (value === "DISCOUNT") {
        return "折扣券"
    }
    if (value === "DEDUCTION") {
        return "抵扣券"
    }
    if (value === "FULL_SUB") {
        return "减满券"
    } else {
        return "";
    }
})


Vue.filter("filterStatus", (value) => {
    if (value === "All") {
        return "全部"
    }
    if (value === "VALIDING") {
        return "生效中"
    }
    if (value === "WAIT_VALID") {
        return "等待生效"
    }
    if (value === "OVERDUE") {
        return "已过期"
    }
    if (value === "STOP") {
        return "停发"
    } else {
        return "";
    }
})


Vue.filter("billTypeBillStatus", (value) => {
    if (value === "fi") {
        return "收入 "
    }
    if (value === "fo") {
        return "支出"
    }
    if (value === "normal") {
        return "正常"
    }
    if (value === "invalid") {
        return "无效"
    }
    if (value === "frozen") {
        return "冻结"
    } else {
        return "";
    }
})

Vue.filter("payChannelType", (value) => {
    if (value === "xkq") {
        return "账户余额"
    }
    if (value === "xkb") {
        return "晓可币"
    }
    if (value === "swq") {
        return "实物券"
    }
    if (value === "xfq") {
        return "消费券"
    }
    if (value === " xfqs") {
        return "店铺消费券"
    }
    if (value === "wls") {
        return "物流余额"
    }
    if (value === "wxpay") {
        return "微信支付 "
    }
    if (value === "alipay") {
        return "支付宝支付"
    }
    if (value === "tfAlipay") {
        return "天府银行-支付宝 "
    }
    if (value === "tfWxpay") {
        return "天府银行-微信"
    }
    else {
        return "";
    }
})



// ------------------------------------抽奖相关---------------------------------

let activityStatusList = { nonValid: "未生效", valid: "生效中", expired: "已过期", canceled: "已取消", finished: "已结束" }
Vue.filter('activityStatus', (value) => {
    return activityStatusList[value] ? activityStatusList[value] : "无"
})


Vue.filter('deliveryType', (value) => {
    if (value === "post") {
        return "邮寄"
    }
    if (value === "scene") {
        return "现场兑奖"
    }
})

let payStatus2List = { DONT_TO_PAY: "无需支付", NON_PAYMENT: "未支付", DURING_PAYMENT: "支付中", PAY_SUCCESS: "支付成功" }
Vue.filter('payStatus2', (value) => {
    return payStatus2List[value] ? payStatus2List[value] : "无"
})


let lotteryTypeList = { liuhe_lottery: "六合彩票", double_chromosphere: "双色球彩票", super_lotto: "超级大乐透" }
Vue.filter('lotteryType', (value) => {
    return lotteryTypeList[value] ? lotteryTypeList[value] : "无"
})




let logisticsList = { SF: "顺丰", YD: "韵达", ZT: "中通", ST: "申通", YT: "圆通", ZBSHTT: "百世汇通" }
Vue.filter('logistics', (value) => {
    return logisticsList[value] ? logisticsList[value] : "无"
})



//---------------- 联盟商收益

const BIG_CLASSIFY = {
    "PLATFORM": "平台收益", "DEALERS": "自营", "WHOLESALE": "批发", "GAME": "游戏", "LIVE_EARNINGS": "直播体系收益"
}

Vue.filter('bigType', (value) => {
    return BIG_CLASSIFY[value] && BIG_CLASSIFY[value] !== undefined ? BIG_CLASSIFY[value] : "无"
})



const SUB_CLASSIFY = {
    "ss": "(商戶)单笔销售", "ms": "(商戶)维护收益", "msbs": "(商戶)单次批量销售", "mms": "(商戶)月销售额", "mssb": "(商戶)销售补贴-购买用户",
    "usbs": "(普通用戶)单次批量销售", "ums": "(普通用戶)月销售额", "ussb": "(普通用戶)销售补贴-购买用户", "ssr": "(商戶)销售补贴-区域合伙人",
    "r1d": "终生客户-直接分成收益", "r1m": "终生客户-维护分成收益", "r2d": "终生联盟商-直接分成收益", "r2m": "终生联盟商-维护分成收益", "r3d": "终身联盟商招募-直接分成收益",
    "r3m": "终身联盟商招募-维护分成收益", "rpmd": "区域合伙人维护收益-直接分成收益", "rpmm": "区域合伙人维护收益-维护分成收益", "ferrous": "主播铁粉收益",
    "sau": "货源奖励-推荐联盟商", "saup": "货源奖励-维护推荐联盟商的合伙人", "familyl1": "家族收益", "o_familyl1": "原始家族收益", "familyl2": "砖石家族收益-工会收益",
    "o_familyl2": "原始砖石家族收益", "anchor": "主播收益", "family_escrow": "家族代管主播收益", "truncation": "分成舍账金额", "platform": "平台收入金额",
    "jackpot": "奖池抽成金额", "bcircle_mr": "(商户用户)商圈订单-商家收入金额", "gce": "游戏订单-公司收入金额", "grp": "礼物订单-(普通用户)收礼者所得", "lottery_mi": "(商户用户)彩票-彩票来源是商户,中奖后分得的金额"
};
Vue.filter('smallType', (value) => {
    return SUB_CLASSIFY[value] ? SUB_CLASSIFY[value] : "无"
})

const dividedBizTypeList = {
    "ALL": "全部", "DEALERS": "精选商城", "WHOLESALE": "批发商城", "BCIRCLE": "商圈", "GIFT": "礼物", "GAME": "游戏", "LOTTERY": "彩票"
}

Vue.filter('dividedBizType', (value) => {
    return dividedBizTypeList[value] && dividedBizTypeList[value] !== undefined ? dividedBizTypeList[value] : "无"
})


const MajorRevenueTypeList = {
    "RECOMMEND": "平台收益", "SALES": "销售收益", "SOURCE_AWARD": "推荐商品收益", "LIVE_EARNINGS": "直播收益"
}
Vue.filter('MajorRevenueType', (value) => {
    return MajorRevenueTypeList[value] && MajorRevenueTypeList[value] !== undefined ? MajorRevenueTypeList[value] : "无"
})


const taxRebateStatusList = {
    "APPLYING": "申请中", "AGREE": "同意", "REJECT": "拒绝", 'null': "未申请"
}
Vue.filter('taxRebateStatus', (value) => {
    return taxRebateStatusList[value] && taxRebateStatusList[value] !== undefined ? taxRebateStatusList[value] : "无"
})

//金钱保留2位小数
Vue.filter('xkmoney', (value) => {
    return math.divide(value, 100).toFixed(2);
})

const currencyList = {
    "rmb": "现金", "xfq": "消费券", "swq": "实物券", 'yhq': "单品优惠券"
}
Vue.filter('currency', (value) => {
    return currencyList[value] && currencyList[value] !== undefined ? currencyList[value] : "无"
})
