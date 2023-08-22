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
import {useParams} from "umi";
import {useModel} from "@@/plugin-model/useModel";
import moment from "moment/moment";

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialData: APIModel.BatchData[] = [
    {
        shipmentNum: 'SPHK-QY-0012',
        truckingCompany: '招商局建瑞运输有限公司',
        grossWeight: 0,
        measurement: 0,
        pieces: 0,
        vehicleType: '集装箱运输货车',
        licensePlateNum: '',
        driverName: '',
        receivingContact: '',
        receivingContactTelephone: '',
    },
    {
        shipmentNum: 'SPHK-QY-0013',
        truckingCompany: '招商局建瑞运输有限公司',
        grossWeight: 0,
        measurement: 0,
        pieces: 0,
        vehicleType: '通用货车',
        licensePlateNum: '',
        driverName: '',
        receivingContact: '',
        receivingContactTelephone: '',
    },
]

const LocalDelivery: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);

    const renderContent = (key: string, data?: APIModel.BatchData) => {
        return <BasicInfo
            form={form}
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

    const {
        queryLocalDeliveryInfo, addLocalDelivery, editLocalDelivery,
    } = useModel('job.job', (res: any) => ({
        queryLocalDeliveryInfo: res.queryLocalDeliveryInfo,
        addLocalDelivery: res.addLocalDelivery,
        editLocalDelivery: res.editLocalDelivery,
    }));

    const [loading, setLoading] = useState(false);
    const [localDeliveryInfo, setLocalDeliveryInfo] = useState<any>({});
    const [id, setId] = useState<string>('0');

    const [tabList, setTabList] = useState(initialTabList);
    const [activeKey, setActiveKey] = useState(initialTabList[0].key);
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(3);

    /**
     * @Description: TODO: 查询本地交付服务信息
     * @author LLS
     * @date 2023/8/16
     * @returns
     */
    async function handleQueryLocalDeliveryInfo() {
        setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (jobId !== '0') {
            result = await queryLocalDeliveryInfo({id: jobId});
            // TODO: 把当前服务的 id 存下来
            if (result.data) {
                setId(result.data.id);
            } else {
                result.data = {blTypeId: 1};
            }
        } else {
            result = {success: true, data: {blTypeId: 1}};
        }
        setLoading(false);
        setLocalDeliveryInfo(result.data || {});
        return result.data || {};
    }

    const handleFinish = async (val: any) => {
        try {
            // TODO: 删除对应的 table 里的录入数据
            for (const item in val) {
                if (item.indexOf('_table_') > -1) {
                    delete val[item];
                }
            }
            console.log(val);
        } catch {
            // console.log
        }
    };

    const handleAddBatch = () => {
        const newBatch: APIModel.BatchData = {
            shipmentNum: '',
            truckingCompany: '',
            grossWeight: 0,
            measurement: 0,
            pieces: 0,
            vehicleType: '',
            licensePlateNum: '',
            driverName: '',
            receivingContact: '',
            receivingContactTelephone: '',
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
                initialValues={localDeliveryInfo}
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
                }}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                request={async () => handleQueryLocalDeliveryInfo()}
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