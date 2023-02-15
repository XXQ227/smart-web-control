// import {getUserInfo} from '@/utils/auths';

const { NODE_ENV } = process.env;

// TODO: 定义子应用的访问链接
export const entryUrl = {
    development: '//localhost:9001',
    test: 'your test url',
    pre: 'your pre url',
};

// TODO: 导出注册的子应用
export default {
    apps: [
        {
            name: 'cargo',  // 唯一 id
            entry: entryUrl[NODE_ENV || 'development'], // 子应用的地址
            base: '',
            mountElementId: 'cargo',  // 注意这里是子应用要挂载在父应用上的节点id
            props: {
                isMenu: false,
                // accountInfo: getUserInfo(),
            }
        }
    ]
}