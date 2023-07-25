import {message, Select} from 'antd';
import React from 'react';
import {history, useModel} from 'umi';
import './index.less';
import {getUserInfo, initUserInfo} from "@/utils/auths"

const Option = Select.Option;

interface Props {

}

const BranchSelect: React.FC<Props> = (props) => {
    // const {initialState, setInitialState} = useModel('@@initialState');
    // const userInfo = getUserInfo() || initUserInfo;
    const {} = useModel('iam');

    const onMenuClick = (key: string) => {
        // 退出登录，并且将当前的 url 保存
        if (key === 'logout') {
            // const logout = users.logout();

            message.success('Success!');
            history.push(`/user/login`);
            return;
        }
        history.push(`/account/${key}`);
    }

    // const loading = false;
    // const loading = (
    //     <span className={`${styles.action} ${styles.account}`}>
    //   <Spin size="small" style={{marginLeft: 8, marginRight: 8,}}/>
    // </span>
    // );

    // if (!userInfo || !userInfo?.ID) {
    //     return loading;
    // }

    const branchList = [
        {
            value: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('logout')}>
                    香港供应链
                </a>
            )
        },
        {
            value: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('logout')}>
                    深圳供应链
                </a>
            )
        },
        {
            value: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => onMenuClick('logout')}>
                    香港船务
                </a>
            )
        },
    ];

    return (
        <Select className={'ant-select-branch'}>
            {branchList?.map((item: any) =>
                <Option key={item.value}>{item.label}</Option>
            )}
        </Select>
    );
};

export default BranchSelect;
