import React from 'react';
import type {RouteChildrenProps} from 'react-router';
import {Tabs} from 'antd';
import type { TabsProps } from 'antd';
import BasicInfo from './basicInfoForm/job/basicInfo';
import JobChargeInfo from './charge';

const TicketForm: React.FC<RouteChildrenProps> = (props) => {

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `业务详情`,
            children: <BasicInfo Principal={{
                SalesManID: 0,
                SalesManName: '',
                PrincipalXID: 0,
                PrincipalXName: '',
                PrincipalXNameEN: '',
                PayerID: undefined,
                PayerName: undefined,
                PayerNameEN: undefined,
                CargoOwnerID: undefined,
                CargoOwnerName: undefined,
                CargoOwnerNameEN: undefined,
                BookingUserID: undefined,
                BookingUserName: undefined,
                PONum: undefined,
                POLID: undefined,
                POLName: undefined
            }} SalesManList={[]} FormItem={undefined} title={''} {...props} />,
        },
        {
            key: '2',
            label: '费用详情',
            children: <JobChargeInfo {...props} />,
        },
    ];

    return (
        <Tabs
            items={items}
            defaultActiveKey="1"
            onChange={onChange}
        />
    )
}
export default TicketForm;
