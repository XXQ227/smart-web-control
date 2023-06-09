import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {PageContainer, ProCard} from '@ant-design/pro-components'
import PortSeaIndex from '@/pages/sys-manager/port/port-sea'
import PortAirIndex from '@/pages/sys-manager/port/port-air'
import PortLand from '@/pages/sys-manager/port/port-land'
import PortTradePlace from '@/pages/sys-manager/port/port-trade-place'


const PortListIndex: React.FC<RouteChildrenProps> = () => {

    const [activeKey, setActiveKey] = useState('Sea');

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard
                className={'ant-card-pro-table'}
                tabs={{
                    activeKey: activeKey,
                    tabPosition: 'left',
                    onChange: setActiveKey,
                    // TODO: 被隐藏时销毁 DOM 结构，这样就会重新加载数据
                    destroyInactiveTabPane: true,
                    items: [
                        {
                            label: 'Sea',
                            key: 'Sea',
                            children: <PortSeaIndex />,
                        },
                        {
                            label: 'Air',
                            key: 'Air',
                            children: <PortAirIndex />,
                        },
                        {
                            label: 'Land',
                            key: 'Land',
                            children: <PortLand />,
                        },
                        {
                            label: 'Trade place',
                            key: 'TradePlace',
                            children: <PortTradePlace />,
                        },
                    ],
                }}
            />
        </PageContainer>
    )
}
export default PortListIndex;