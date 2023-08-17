import React, {useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import BillingAR from '@/pages/sys-bill/bill/ar'
import BillingAP from '@/pages/sys-bill/bill/ap'
import BillingInvoice from '@/pages/sys-bill/bill/invoice'
import '@/pages/sys-job/job/style.less';
import type {TabsProps} from 'antd'
import {Button, Tabs} from 'antd'


const Bill: React.FC<RouteChildrenProps> = (props) => {


    const [activeKey, setActiveKey] = useState<string>('ar');


    const onTabChange = (key: string) => {
        setActiveKey(key);
        window.scroll({top: 0});
    };

    // 动态生成标签页信息
    const initialTabList = [
        { tab: 'AR', key: 'ar', closable: false,  },
        { tab: 'AP', key: 'ap', closable: false,  },
        { tab: 'Invoice', key: 'invoice', closable: false },
    ];

    const items: TabsProps['items'] = [
        {key: 'ar', label: `AR`, children: <BillingAR {...props} />,},
        {key: 'ap', label: `AP`, children: <BillingAP {...props} />,},
        {key: 'invoice', label: `Invoice`, children: <BillingInvoice {...props} />,},
    ];

    return (
        <PageContainer
            title={false}
            header={{breadcrumb: {}}}
            // tabList={initialTabList}
            // onTabChange={onTabChange}
            className={`pageContainer stickyTabs`}
            tabProps={{
                activeKey,
                tabBarGutter: 0,
                // tabBarStyle: 'tabBarCard',
                tabBarStyle: {flexGrow: 1},
                // TODO: 被隐藏时销毁 DOM 结构
                destroyInactiveTabPane: true,
            }}
        >
            {/*<ProCard>*/}
            {/*    <Tabs defaultActiveKey={activeKey} items={items} onChange={onTabChange} />*/}
            {/*</ProCard>*/}
            {/*{activeKey === 'ar' && <BillingAR {...props} />}*/}
            {/*{activeKey === 'ap' && <BillingAP {...props} />}*/}
            {/*{activeKey === 'invoice' && <BillingInvoice {...props} />}*/}
        </PageContainer>
    )
}
export default Bill;