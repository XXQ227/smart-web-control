// import {getUserInfo} from '@/utils/auths';
// import entryUrl from '../config/entryUrl';

// const { NODE_ENV } = process.env;

export default {
    apps: [
        {
            name: 'cargo',  // 唯一 id
            // entry: entryUrl[NODE_ENV || 'development'], // 子应用的地址
            entry: '//localhost:9001',
            base: '',
            mountElementId: 'cargo',  // 注意这里是子应用要挂载在父应用上的节点id
            props: {
                isMenu: false,
                // accountInfo: getUserInfo(),
            }
        }
    ]
}