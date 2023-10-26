import {USER_INFO} from '@/utils/auths';

const { NODE_ENV } = process.env;

// TODO: 定义 Cargo 子应用的访问链接
const entryCargoUrl = {
    development: '//localhost:9001',
    test: 'your test url',
    pre: 'your pre url',
};
// TODO: 定义 Bill 子应用的访问链接
const entryBillUrl = {
    development: '//localhost:9002',
    test: 'your test url',
    pre: 'your pre url',
};
// TODO: 定义 Manager 子应用的访问链接
const entryManagerUrl = {
    development: '//localhost:9003',
    test: 'your test url',
    pre: 'your pre url',
};

// TODO: 导出注册的子应用
export default {
    apps: [
        {
            name: 'job',  // 唯一 id
            entry: entryCargoUrl[NODE_ENV || 'development'], // 子应用的地址
            // base: '/job',
            // history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
            // mountElementId: 'job',  // 注意这里是子应用要挂载在父应用上的节点id
            props: {
                isMenu: false,
                userInfo: USER_INFO(),
            },
            jsSandbox: true, // 是否启用 js 沙箱，默认为 false
            prefetch: true, // 是否启用 prefetch 特性，默认为 true
        },
        {
            name: 'bill',  // 唯一 id
            entry: entryBillUrl[NODE_ENV || 'development'], // 子应用的地址
            // base: '/bill',
            // history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
            // mountElementId: 'bill',  // 注意这里是子应用要挂载在父应用上的节点id
            props: {
                isMenu: false,
                userInfo: USER_INFO(),
            },
            jsSandbox: true, // 是否启用 js 沙箱，默认为 false
            prefetch: true, // 是否启用 prefetch 特性，默认为 true
        },
        {
            name: 'manager',  // 唯一 id
            entry: entryManagerUrl[NODE_ENV || 'development'], // 子应用的地址
            // base: '/system',
            // history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
            // mountElementId: 'system',  // 注意这里是子应用要挂载在父应用上的节点id
            props: {
                isMenu: false,
                userInfo: USER_INFO(),
            },
            jsSandbox: true, // 是否启用 js 沙箱，默认为 false
            prefetch: true, // 是否启用 prefetch 特性，默认为 true
        },
    ]
}