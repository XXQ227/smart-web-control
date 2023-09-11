import {message, Select} from 'antd';
import React from 'react';
import {history, useModel} from 'umi';
import './index.less';

const Option = Select.Option;

const ChooseBranch: React.FC = () => {
    // const {initialState, setInitialState} = useModel('@@initialState');
    // const userInfo = getUserInfo() || initUserInfo;
    const {iamUserOrganizationConvert} = useModel('manager.auth', (res: any)=> ({
        iamUserOrganizationConvert: res.iamUserOrganizationConvert,
    }));

    /**
     * @Description: TODO: 切换公司组织
     * @author XXQ
     * @date 2023/8/24
     * @param key
     * @returns
     */
    const onMenuClick = async (key: string) => {
        const result: API.Result = await iamUserOrganizationConvert({userNo: key});
        if (result.success) {
            // TODO: 重新获取公司数据，并且回到 welcome 页面
            history.push('/welcome');
        } else {
            if (result.message) message.error(result.message);
        }
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
        {value: '1', label: <a target="_blank">香港供应链</a>},
        {value: '2', label: <a target="_blank">深圳供应链</a>},
        {value: '3', label: <a target="_blank">香港船务</a>},
    ];

    return (
        <Select className={'ant-select-branch'} onSelect={(e: any) => onMenuClick(e)}>
            {branchList?.map((item: any) =>
                <Option key={item.value}>{item.label}</Option>
            )}
        </Select>
    );
};

export default ChooseBranch;
