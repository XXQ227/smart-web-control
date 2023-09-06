import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {PageContainer} from '@ant-design/pro-components';
import './style.less'
import {HeaderInfo} from '@/utils/units'
import AddServiceModal from '@/components/AddServiceModal'
import {message} from 'antd'
import {useParams} from 'umi'
import JobInfo from './job'
import JobChargeInfo from './charge';
import ChargeRefund from './charge-refund'
import SeaExport from './sea-export'
import SeaImport from './sea-import'
import LocalDelivery from './local-delivery'

const TicketForm: React.FC<RouteChildrenProps> = (props) => {

    const params: any = useParams();
    const id = atob(params.id);
    const isCreate: boolean = id === '0';

    // 动态生成标签页信息
    const initialTabList = [
        { tab: 'Job', key: 'job', closable: false, },
        { tab: 'Charge', key: 'charge', closable: false, },
        { tab: 'Refund-Charge', key: 'refund-charge', closable: false, },
        { tab: 'Sea (Export)', key: 'sea-export', closable: false },
        { tab: 'Sea (Import)', key: 'sea-import', closable: false },
        { tab: 'Local Delivery', key: 'local-delivery', closable: false },
    ];

    const [activeKey, setActiveKey] = useState<string>('charge');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [tabList, setTabList] = useState(initialTabList);

    const showModal = (state: boolean) => {
        setIsModalOpen(state);
    };

    const onTabChange = (key: string) => {
        setActiveKey(key);
        window.scroll({top: 0});
    };

    /**
     * @Description: TODO: 添加 job 服务
     * @author XXQ
     * @date 2023/7/26
     * @param checkedValue
     * @returns
     */
    const add = (checkedValue: string) => {
        const newPanes = [...tabList];
        const targetIndex = tabList.findIndex((pane) => pane.key === checkedValue);
        if (targetIndex < 0) {
            newPanes.push({ tab: checkedValue, key: checkedValue, closable: true });
            setTabList(newPanes);
            setActiveKey(checkedValue);
        } else {
            message.warning({
                content: 'This service type has already been added.',
                style: {
                    fontSize: 16,
                },
                duration: 5,
            });
        }
    };

    /**
     * @Description: TODO: 保存 job 服务
     * @author XXQ
     * @date 2023/7/26
     * @param checkedValue
     * @returns
     */
    const handleOk = (checkedValue: string) => {
        setIsModalOpen(false);
        add(checkedValue);
    };

    return (
        <PageContainer
            title={false}
            tabList={tabList}
            header={{breadcrumb: {}}}
            onTabChange={onTabChange}
            className={'pageContainer stickyTabs'}
            content={HeaderInfo({}, '2022-03-02', 'Admin')}
            tabProps={{
                activeKey,
                type: 'editable-card',
                tabBarGutter: 0,
                // tabBarStyle: 'tabBarCard',
                tabBarStyle: {flexGrow: 1},
                // TODO: 被隐藏时销毁 DOM 结构
                destroyInactiveTabPane: true,
                // onEdit: onEdit,
            }}
        >
            {activeKey === 'job' && <JobInfo {...props}/>}
            {activeKey === 'charge' && !isCreate && <JobChargeInfo {...props}/>}
            {activeKey === 'refund-charge' && !isCreate && <ChargeRefund {...props}/>}
            {activeKey === 'sea-export' && <SeaExport {...props}/>}
            {activeKey === 'sea-import' && <SeaImport {...props}/>}
            {activeKey === 'local-delivery' && <LocalDelivery {...props}/>}

            {/*<Tabs
                items={items}
                defaultActiveKey="1"
                onChange={onChange}
                destroyInactiveTabPane={true}
            />*/}
            <AddServiceModal
                onOk={handleOk}
                open={isModalOpen}
                onCancel={()=> showModal(false)}
            />
        </PageContainer>
    )
}
export default TicketForm;
