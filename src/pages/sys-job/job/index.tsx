import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {PageContainer} from '@ant-design/pro-components';
import './style.less';
import {getServiceTypeName, HeaderInfo} from '@/utils/units';
import AddServiceModal from '@/components/AddServiceModal';
import {message, Modal} from 'antd';
import {useParams} from 'umi';
import JobInfo from './job';
import JobChargeInfo from './charge';
import ChargeRefund from './charge-refund';
import SeaExport from './sea-export';
import SeaImport from './sea-import';
import LocalDelivery from './local-delivery';
import {ExclamationCircleFilled} from "@ant-design/icons";
import {useModel} from "@@/plugin-model/useModel";

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const TicketForm: React.FC<RouteChildrenProps> = (props) => {
    const params: any = useParams();
    const id = atob(params.id);
    const isCreate: boolean = id === '0';

    // 动态生成标签页信息
    const initialTabList = [
        { tab: 'Job', key: 'job', closable: false, },
        { tab: 'Charge', key: 'charge', closable: false, },
        { tab: 'Refund-Charge', key: 'refund-charge', closable: false, },
        /*{ tab: 'Sea (Export)', key: 'sea-export', closable: false },
        { tab: 'Sea (Import)', key: 'sea-import', closable: false },
        { tab: 'Local Delivery', key: 'local-delivery', closable: false },*/
    ];

    const {
        jobHeaderInfo, ServiceTypeList
    } = useModel('job.job', (res: any) => ({
        jobHeaderInfo: res.jobHeaderInfo,
        ServiceTypeList: res.ServiceTypeList,
    }));

    const [activeKey, setActiveKey] = useState<string>('job');
    const [tabList, setTabList] = useState(initialTabList);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [headerInfo, setHeaderInfo] = useState({});
    const [changedTabName, setChangedTabName] = useState('');

    useEffect(() => {
        setLoading(true);
        if (id !== '0' && Object.keys(jobHeaderInfo).length > 0 && jobHeaderInfo?.jobId === id) {
            setHeaderInfo(jobHeaderInfo);
        }
        setLoading(false);
    }, [jobHeaderInfo, id]);

    useEffect(() => {
        setLoading(true);
        if (id !== '0' && ServiceTypeList?.length > 0) {
            setTabList([]);
            const labelToTabConfig = {
                "1": { tab: 'Sea (Import)', key: 'sea-import', closable: false },
                "2": { tab: 'Sea (Export)', key: 'sea-export', closable: false },
                "7": { tab: 'Local Delivery', key: 'local-delivery', closable: false }
            };
            const addedLabels = new Set(); // 使用 Set 来跟踪已添加的标签值
            const tabConfigs: any[] = [];
            // 根据 label 值生成标签页配置
            ServiceTypeList.forEach((item: any) => {
                const label = item.label;
                if (!addedLabels.has(label) && labelToTabConfig[label]) {
                    tabConfigs.push(labelToTabConfig[label]);
                    addedLabels.add(label);
                }
            });
            if (tabConfigs) {
                setTabList([...initialTabList, ...tabConfigs]);
            }
        } else if (id !== '0' && ServiceTypeList?.length === 0) {
            setTabList(initialTabList);
        }
        setLoading(false);
    }, [ServiceTypeList]);

    const showModal = (state: boolean) => {
        setIsModalOpen(state);
    };

    /**
     * @Description: TODO: 导航栏切换事件
     * @author LLS
     * @date 2023/9/21
     * @param key
     * @returns
     */
    const onTabChange = (key: string) => {
        // TODO: 返回时判断有没有编辑过，有就弹出提示
        if (!changedTabName) {
            setActiveKey(key);
            window.scroll({top: 0});
        } else {
            confirm({
                title: `Confirm to switch to ${getServiceTypeName(key)} ?`,
                content: 'The current information has been modified.',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    setChangedTabName('');
                    setActiveKey(key);
                    window.scroll({top: 0});
                }
            });
        }
    };

    /**
     * @Description: TODO: 添加 job 服务
     * @author LLS
     * @date 2023/9/18
     * @param checkedValue
     * @returns
     */
    const add = (checkedValue: string) => {
        setIsModalOpen(false);
        const newPanes = [...tabList];
        const targetIndex = tabList.findIndex((pane) => pane.key === checkedValue);
        if (targetIndex < 0) {
            setChangedTabName('');
            newPanes.push({ tab: getServiceTypeName(checkedValue), key: checkedValue, closable: true });
            setTabList(newPanes);
            setActiveKey(checkedValue);
        } else {
            message.warning({
                content: 'This service type has already been added.',
                style: {fontSize: 16},
                duration: 5,
            });
        }
    };

    /**
     * @Description: TODO: 删除 job 服务
     * @author LLS
     * @date 2023/9/18
     * @param targetKey
     */
    const remove = (targetKey: TargetKey) => {
        confirm({
            title: `Are you sure delete this service type 【${targetKey}】?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
                const newPanes = tabList.filter((pane) => pane.key !== targetKey);
                if (newPanes.length && targetKey === activeKey) {
                    const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                    setActiveKey(key);
                }
                setTabList(newPanes);
                setChangedTabName('');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            if (id !== '0') {
                if (!changedTabName) {
                    showModal(true);
                } else {
                    confirm({
                        title: `Confirm to add new service ?`,
                        content: 'The current information has been modified.',
                        icon: <ExclamationCircleFilled />,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk() {
                            showModal(true);
                        }
                    });
                }
            } else {
                message.warning({
                    content: 'Please save the Job information first.',
                    style: {fontSize: 16},
                    duration: 5,
                });
            }
        } else {
            remove(targetKey);
        }
    };

    /**
     * @Description: TODO: 当服务被保存时，同时修改对应的服务页签禁止关闭
     * @author LLS
     * @date 2023/9/20
     * @returns
     */
    const handleChangeTabs = (value: string) => {
        setTabList(prevTabList => {
            const updatedTabList = [...prevTabList];
            const activeTab = updatedTabList.find(tab => tab.key === value);
            if (activeTab) {
                activeTab.closable = false;
            }
            return updatedTabList;
        });
    }

    const baseProps = {...props, handleChangeTabs, handleChangedTabName: (value: string) => setChangedTabName(value) };

    return (
        <PageContainer
            title={false}
            className={'pageContainer stickyTabs'}
            content={HeaderInfo(headerInfo)}
            loading={loading}
            header={{breadcrumb: {}}}
            tabList={tabList}
            onTabChange={onTabChange}
            tabProps={{
                activeKey,
                type: 'editable-card',
                tabBarGutter: 0,
                // tabBarStyle: 'tabBarCard',
                tabBarStyle: {flexGrow: 1},
                // TODO: 被隐藏时销毁 DOM 结构
                destroyInactiveTabPane: true,
                onEdit: onEdit,
            }}
        >
            {activeKey === 'job' && <JobInfo {...baseProps}/>}
            {activeKey === 'charge' && !isCreate && <JobChargeInfo {...baseProps}/>}
            {activeKey === 'refund-charge' && !isCreate && <ChargeRefund {...baseProps}/>}
            {activeKey === 'sea-import' && <SeaImport {...baseProps}/>}
            {activeKey === 'sea-export' && <SeaExport {...baseProps} headerInfo={headerInfo}/>}
            {activeKey === 'foreignVehicle' && <LocalDelivery {...baseProps} type='foreignVehicle'/>}
            {activeKey === 'land-forwarder' && <LocalDelivery {...baseProps} type='land-forwarder'/>}
            {activeKey === 'local-delivery' && <LocalDelivery {...baseProps} type='local-delivery'/>}

            <AddServiceModal
                open={isModalOpen}
                onOk={add}
                onCancel={()=> showModal(false)}
            />
        </PageContainer>
    )
}
export default TicketForm;
