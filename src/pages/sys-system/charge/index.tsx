import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {PageContainer, ProCard} from '@ant-design/pro-components'
import DescriptionIndex from '@/pages/sys-system/charge/description'
import SubjectIndex from '@/pages/sys-system/charge/subject'


const PortListIndex: React.FC<RouteChildrenProps> = () => {

    const [activeKey, setActiveKey] = useState('Description');

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard
                className={'ant-card-pro-table ant-card-pro-tabs'}
                tabs={{
                    activeKey,
                    tabPosition: 'left',
                    onChange: setActiveKey,
                    // TODO: 被隐藏时销毁 DOM 结构，这样就会重新加载数据
                    destroyInactiveTabPane: true,
                    items: [
                        {
                            label: 'Description',
                            key: 'Description',
                            children: <DescriptionIndex />,
                        },
                        {
                            label: 'Subject',
                            key: 'Subject',
                            children: <SubjectIndex />,
                        },
                    ],
                }}
            />
        </PageContainer>
    )
}
export default PortListIndex;