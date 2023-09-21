import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Avatar, message} from 'antd';
import React from 'react';
import {history, useModel} from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {getUserInfo, initUserInfo} from "@/utils/auths";

export type GlobalHeaderRightProps = {
    menu?: boolean;
};

const avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu}) => {
    // const {initialState, setInitialState} = useModel('@@initialState');
    const userInfo = getUserInfo() || initUserInfo;
    const {iamUserLogIn} = useModel('login', (res: any)=> ({
        iamUserLogIn: res.iamUserLogIn,
    }));

    const onMenuClick = async (key: string) => {
        // 退出登录，并且将当前的 url 保存
        if (key === 'logout') {
            const result: API.Result = await iamUserLogIn();
            if (result.success) {
                message.success('Success!');
                history.push(`/user/login`);
                return;
            } else {
                message.error(result.message);
            }
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
            key: 'center', disabled: !userInfo?.ID, icon: <UserOutlined/>,
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('center')}>
                    个人中心
                </a>
            ),
        },
        {
            key: 'settings', disabled: !userInfo?.ID, icon: <SettingOutlined/>,
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
                    <span className={`${styles.name} anticon`}>{userInfo.DisplayName}</span>
                </span>
            </a>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
