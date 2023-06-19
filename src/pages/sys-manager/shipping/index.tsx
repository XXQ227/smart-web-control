import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {PageContainer, ProCard} from '@ant-design/pro-components'
import ShippingVoyageIndex from '@/pages/sys-manager/shipping/shipping-voyage'
import ShippingVesselIndex from '@/pages/sys-manager/shipping/shipping-vessel'
import ShippingLineIndex from '@/pages/sys-manager/shipping/shipping-line'

const ShippingListIndex: React.FC<RouteChildrenProps> = () => {

    const [activeKey, setActiveKey] = useState('Voyage');

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
                            label: 'Voyage',
                            key: 'Voyage',
                            children: <ShippingVoyageIndex />,
                        },
                        {
                            label: 'Vessel',
                            key: 'Vessel',
                            children: <ShippingVesselIndex />,
                        },
                        {
                            label: 'Shipping Line',
                            key: 'Shipping Line',
                            children: <ShippingLineIndex />,
                        },
                    ],
                }}
            />
        </PageContainer>
    )
}
export default ShippingListIndex;