import React, {useState, useRef} from 'react';
import BasicInfo from './basicInfo';
import {Modal, Tabs, Spin, Button, message, Form} from "antd";
import type {TabsProps} from 'antd';
import '../style.less'
import {FooterToolbar, ProForm, ProCard} from "@ant-design/pro-components";
import {ExclamationCircleFilled, LeftOutlined, SaveOutlined} from "@ant-design/icons";
import type { RouteChildrenProps } from 'react-router';
import {history} from "@@/core/history";
import {getFormErrorMsg} from "@/utils/units";

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialData: APIModel.BatchData[] = [
    {
        shipmentNo: 'SPHK-QY-0012',
        truckingCompany: '招商局建瑞运输有限公司',
        grossWeight: 0,
        measurement: 0,
        pieces: 0,
        vehicleType: '集装箱运输货车',
        plateNo: '',
        driverName: '',
        receivingContac: '',
        phone: '',
    },
    {
        shipmentNo: 'SPHK-QY-0013',
        truckingCompany: '招商局建瑞运输有限公司',
        grossWeight: 0,
        measurement: 0,
        pieces: 0,
        vehicleType: '通用货车',
        plateNo: '',
        driverName: '',
        receivingContac: '',
        phone: '',
    },
]

const LocalDelivery: React.FC<RouteChildrenProps> = (props) => {
    const renderContent = (key: string, data?: APIModel.BatchData) => {
        return <BasicInfo
            CTNPlanList={[]}
            NBasicInfo={{}}
            batchNo={key}
            data={data}
            handleChangeLabel={(val: any) => handleChangeLabel(val)}
        />
    }

    const initialTabList: TabsProps['items'] = [
        {
            label: 'SPHK-QY-0012',
            key: '1',
            closable: false,
            children: renderContent('SPHK-QY-0012', initialData[0]),
        },
        {
            label: 'SPHK-QY-0013',
            key: '2',
            closable: false,
            children: renderContent('SPHK-QY-0013', initialData[1]),
        },
    ];

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tabList, setTabList] = useState(initialTabList);
    const [activeKey, setActiveKey] = useState(initialTabList[0].key);
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(3);

    const handleAddBatch = () => {
        const newBatch: APIModel.BatchData = {
            shipmentNo: '',
            truckingCompany: '',
            grossWeight: 0,
            measurement: 0,
            pieces: 0,
            vehicleType: '',
            plateNo: '',
            driverName: '',
            receivingContac: '',
            phone: '',
        };

        const newActiveKey = (newTabIndex.current++).toString()
        setTabList(prevTabList => [
            ...prevTabList,
            {
                label: 'New Tab',
                key: newActiveKey,
                closable: true,
                children: renderContent(newActiveKey, newBatch),
            },
        ]);
        setActiveKey(newActiveKey);
    };

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    const remove = (targetKey: TargetKey) => {
        confirm({
            title: `Are you sure delete this shipment 【${targetKey}】?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
                const newPanes = tabList.filter((tab) => tab.key !== targetKey);
                if (newPanes.length && targetKey === activeKey) {
                    const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                    setActiveKey(key);
                }
                setTabList(newPanes);
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
            handleAddBatch()
        } else {
            remove(targetKey);
        }
    };

    function handleChangeLabel(value: any) {
        setTabList(prevTabList => {
            const updatedTabList = [...prevTabList];
            const activeTab = updatedTabList.find(tab => tab.key === activeKeyRef.current);
            if (activeTab) {
                activeTab.label = value;
            }
            return updatedTabList;
        });
    }

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                omitNil={false}
                layout="vertical"
                name={'formJobInfo'}
                // initialValues={CJobInfo}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () =>
                        <FooterToolbar
                            style={{height: 55}}
                            extra={
                                <Button icon={<LeftOutlined/>} onClick={() => history.goBack()}>Back</Button>
                            }>
                            <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'} htmlType={'submit'}>
                                Save
                            </Button>
                        </FooterToolbar>
                    ,
                }}
                // onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => handleQueryJobInfo({id})}
            >
                <ProCard
                    className={'localDelivery'}
                    title={'Basic Information'}
                    bordered={true}
                    headerBordered
                    collapsible
                >
                    <Tabs
                        type="editable-card"
                        activeKey={activeKey}
                        onChange={handleTabChange}
                        onEdit={onEdit}
                        items={tabList}
                    >
                        {/*{tabList.map(tab => (
                            <Tabs.TabPane key={tab.key} tab={tab.label} closable={tab.closable}>
                                {tab.content}
                            </Tabs.TabPane>
                        ))}*/}
                    </Tabs>
                </ProCard>
            </ProForm>
        </Spin>
    )
}
export default LocalDelivery;