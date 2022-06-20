/*
 * @Author: your name
 * @Date: 2021-12-01 14:35:03
 * @LastEditTime: 2021-12-03 10:01:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \tj_law_firm\common\config.js
 */
/**
 * 项目全局配置文件
 */
const ENV_ENUM = {
    TEST: 0, // 测试
    PRE: 1, // 预发布
    PRO: 2 //
} // 环境变量枚举

// ======== 全局环境变量 ========
const ENV = ENV_ENUM.TEST

// 接口域名集合
const DOMAIN_ENUM = {
    'lawyer': {
        0: 'https://t-xiaofa-lawyer.aegis-info.com',
        1: 'https://r-xiaofa-lawyer.aegis-info.com',
        2: 'https://xiaofa-lawyer.aegis-info.com'
    },
    'xiaofa': {
        0: 'https://xiaofa.aegis-info.com/api/',
        1: 'https://xiaofa.aegis-info.com/api/',
        2: 'https://xiaofa.aegis-info.com/api/'
    },
    'gateway': {
        0: 'https://t-xiaofa-gateway.aegis-info.com/',
        1: 'https://r-xiaofa-gateway.aegis-info.com/',
        2: 'https://xiaofabu-gateway.aegis-info.com/'
    },
    'xiaofa-pay': {
        0: 'http://yapi-xiaofa.aegis-info.com/mock/57/',
        1: 'http://yapi-xiaofa.aegis-info.com/mock/57/',
        2: 'http://yapi-xiaofa.aegis-info.com/mock/57/'
    },
    'wss_im': {
        0: 'wss://t-xiaofa-lawyer.aegis-info.com/mall-websockets/ws',
        1: 'wss://r-xiaofa-lawyer.aegis-info.com/mall-websockets/ws',
        2: 'wss://xiaofa-lawyer.aegis-info.com/mall-websockets/ws'
    },
    'ilawpush5': {
        0: 'https://t-ilawpush5.aegis-info.com',
        1: 'https://r-ilawpush5.aegis-info.com',
        2: 'https://ilawpush5.aegis-info.com'
    },
    'xiaofa-business':{
        0:'https://t-xiaofa-gateway.aegis-info.com/xiaofa-business',
        1:'https://r-xiaofa-gateway.aegis-info.com/xiaofa-business',
        2:'https://xiaofa-gateway.aegis-info.com/xiaofa-business'
    }
}
const domain = {
    lawyer_domain: DOMAIN_ENUM['lawyer'][ENV],
    xiaofa_domain: DOMAIN_ENUM['xiaofa'][ENV],
    wss_im_domain: DOMAIN_ENUM['wss_im'][ENV],
    gateway_doamin: DOMAIN_ENUM['gateway'][ENV],
    xiaofa_pay: DOMAIN_ENUM['xiaofa-pay'][ENV],
    ilawpush5: DOMAIN_ENUM['ilawpush5'][ENV],
    xiaofa_business:DOMAIN_ENUM['xiaofa-business'][ENV]
}

export default {
    domain,
    ENV,
    ENV_LABEL: ['测试', '预发布', '生产'][ENV]
}
