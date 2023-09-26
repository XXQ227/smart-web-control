import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Avatar, message} from 'antd';
import React from 'react';
import {history, useModel} from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {USER_NAME, USER_ID} from "@/utils/auths";

export type GlobalHeaderRightProps = {
    menu?: any;
};

const avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
    const {logout} = useModel('login', (res: any)=> ({logout: res.logout}));

    const onMenuClick = async (key: string) => {
        // 退出登录，并且将当前的 url 保存
        if (key === 'logout') {
            const result: API.Result = await logout();
            if (result.success) {
                message.success('success!');
                window.close();
                return;
            } else {
                if (result.message) message.error(result.message);
            }
        } else if (key === 'center') {
            return;
        }
        history.push(`/account/${key}`);
    }

    // const loading = (
    //     <span className={`${styles.action} ${styles.account}`}>
    //   <Spin size="small" style={{marginLeft: 8, marginRight: 8,}}/>
    // </span>
    // );

    // console.log(userInfo);
    // if (!userInfo || !userInfo?.ID) {
    //     return loading;
    // }

    const items: MenuProps['items'] = [
        {
            key: 'center', disabled: !!USER_ID(), icon: <UserOutlined/>,
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('center')}>
                    个人中心
                </a>
            ),
        },
        {
            key: 'settings', disabled: !!USER_ID(), icon: <SettingOutlined/>,
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('settings')}>
                    个人设置
                </a>
            ),
        },
        {type: 'divider',},
        {
            key: 'logout', icon: <LogoutOutlined/>,
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('logout')}>
                    退出登录
                </a>
            ),
        },
    ];

    return (
        <HeaderDropdown menu={{items}}>
            <a target="_blank" rel="noopener noreferrer" onClick={()=> onMenuClick('center')}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={avatar} alt="avatar"/>
                    <span className={`${styles.name} anticon`}>{USER_NAME()}</span>
                </span>
            </a>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
