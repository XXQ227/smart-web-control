import React, {useState, useRef, useEffect} from 'react';
import BasicInfo from './basicInfo';
import {Modal, Tabs, Spin, Button, message, Form} from "antd";
import type {TabsProps} from 'antd';
import '../style.less'
import type { FormListActionType, ProFormInstance } from "@ant-design/pro-components";
import {
    ProFormList,
    FooterToolbar,
    ProForm,
    ProCard
} from "@ant-design/pro-components";
import {ExclamationCircleFilled, LeftOutlined, SaveOutlined} from "@ant-design/icons";
import type { RouteChildrenProps } from 'react-router';
import {history} from "@@/core/history";
import {getFormErrorMsg} from "@/utils/units";
import {useParams, useModel} from "umi";

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialData = {
    '1': [
        {
            shipmentNum: '',
            truckingCompanyId: null,
            truckingCompanyNameEn: '',
            truckingCompanyNameCn: '',
            truckingCompanyOracleId: null,
            transportVehicleTypeId: null,
            qty: '',
            grossWeight: '',
            measurement: '',
            licensePlateNum: '',
            driverName: '',
        }
    ]
}

const LocalDelivery: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState<string>('0');
    const formRef = useRef<ProFormInstance>();
    const actionRef = useRef<FormListActionType<{name: string;}>>();

    const {
        queryLocalDeliveryInfo, addLocalDelivery, editLocalDelivery, deleteLocalDelivery
    } = useModel('job.job', (res: any) => ({
        queryLocalDeliveryInfo: res.queryLocalDeliveryInfo,
        addLocalDelivery: res.addLocalDelivery,
        editLocalDelivery: res.editLocalDelivery,
        deleteLocalDelivery: res.deleteLocalDelivery,
    }));

    const [localDeliveryInfo, setLocalDeliveryInfo] = useState<any>(initialData || {});
    const initialTabList: TabsProps['items'] = [];
    const [tabList, setTabList] = useState(initialTabList);
    const [activeKey, setActiveKey] = useState<string>('1');
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(2);

    const handleChangeLabel = (value: any) => {
        let labelName = value;
        if (!value) {
            labelName = 'New Tab';
        }
        setTabList(prevTabList => {
            const updatedTabList = [...prevTabList];
            const activeTab = updatedTabList.find(tab => tab.key === activeKeyRef.current);
            if (activeTab) {
                activeTab.label = labelName;
            }
            return updatedTabList;
        });
    }

    const renderContent = (key: string, data?: any) => {
        return <ProFormList
            name={`${key}`}
            initialValue={data[key]}
            creatorButtonProps={false}
            copyIconProps={false}
            deleteIconProps={false}
            actionRef={actionRef}
        >
            {(f, index, action) => {
                return (
                    <>
                        <BasicInfo
                            form={form}
                            CTNPlanList={[]}
                            batchNo={key}
                            data={data[key]}
                            handleChangeLabel={(val: any) => handleChangeLabel(val)}
                            handleChangeData={(val: any) => action.setCurrentRowData(val)}
                        />
                    </>
                );
            }}
        </ProFormList>
    }

    const handleAddBatch = () => {
        const newBatch = {
            shipmentNum: '',
            truckingCompanyId: null,
            truckingCompanyNameEn: '',
            truckingCompanyNameCn: '',
            truckingCompanyOracleId: null,
            transportVehicleTypeId: null,
            qty: '',
            grossWeight: '',
            measurement: '',
            licensePlateNum: '',
            driverName: '',
        };

        const newActiveKey = (newTabIndex.current++).toString();
        const newLocalDeliveryInfo = {
            ...localDeliveryInfo,
            [newActiveKey]: [newBatch]
        }
        setLocalDeliveryInfo(newLocalDeliveryInfo);
        setTabList(prevTabList => [
            ...prevTabList,
            {
                label: 'New Tab',
                key: newActiveKey,
                closable: true,
                children: renderContent(newActiveKey, newLocalDeliveryInfo),
            },
        ]);
        setActiveKey(newActiveKey);
    };

    /**
     * @Description: TODO: 查询本地交付服务信息
     * @author LLS
     * @date 2023/8/16
     * @returns
     */
    async function handleQueryLocalDeliveryInfo(state?: string) {
        setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (jobId !== '0') {
            result = await queryLocalDeliveryInfo({id: jobId});
            if (result.success && result.data) {
                // TODO: 如果有批次数据进行数据转化
                if (result.data.length > 0) {
                    const resultData = {};
                    result.data.forEach((item: any) => {
                        if (!resultData[item.shipmentNum]) {
                            resultData[item.shipmentNum] = [];
                        }
                        resultData[item.shipmentNum].push(item);
                    });
                    // TODO: renderContent(key, resultData) key的值有问题
                    const newTabList: TabsProps['items'] = Object.entries(resultData).map(([key], index) => ({
                        label: key,
                        key: (index + 1).toString(),
                        closable: true,
                        children: renderContent(key, resultData),
                    }));
                    newTabIndex.current = newTabList.length + 1;
                    setLocalDeliveryInfo(resultData);
                    setTabList(newTabList);
                    if (state === 'add' && Number(activeKey) >  Number(newTabList.length.toString())) {
                        setActiveKey(newTabList.length.toString());
                    }
                    // TODO: 把当前服务的 id 存下来
                    setId(result.data.id);
                } else {
                    if (state === 'delete' ) {
                        handleAddBatch();
                    } else {
                        const newTabList: TabsProps['items'] = [
                            {
                                label: 'New Tab',
                                key: '1',
                                closable: false,
                                children: renderContent('1', initialData),
                            }
                        ];
                        setActiveKey('1');
                        setLocalDeliveryInfo(initialData);
                        setTabList(newTabList);
                        setId('0');
                    }
                }
            } else {
                result.data = {blTypeId: 1};
            }
        } else {
            result = {success: true, data: {blTypeId: 1}};
        }
        setLoading(false);
        return result.data || {};
    }

    const handleFinish = async (val: any) => {
        setLoading(true);
        try {
            // TODO: 删除对应的 table 里的录入数据
            for (const item in val) {
                if (item.indexOf('_table_') > -1) {
                    delete val[item];
                }
            }

            const dataWithJobId = [];
            for (const shipmentNum in val) {
                if (val.hasOwnProperty(shipmentNum)) {
                    dataWithJobId.push(...val[shipmentNum].map((item: any) => ({
                        ...item,
                        jobId
                    })));
                }
            }

            let result: API.Result;
            if (id === '0') {
                result = await addLocalDelivery(dataWithJobId);
            } else {
                dataWithJobId.forEach(item => {
                    if (!item.id) {
                        item.id = "0";
                    }
                });
                result = await editLocalDelivery(dataWithJobId);
            }
            if (result.success) {
                message.success('Success!!!');
                // TODO: 把当前服务的 id 存下来
                setId(result.data.id);
                setTabList([]);
                // 清空控件数据
                formRef?.current?.resetFields();
                await handleQueryLocalDeliveryInfo('add');
            } else {
                message.error(result.message);
            }
        } catch (errorInfo) {
            console.error(errorInfo);
        }
        setLoading(false);
    };

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    /**
     * @Description: TODO: 删除本地交付服务信息
     * @author LLS
     * @date 2023/8/3
     * @param labelValue
     * @param targetKey
     */
    const handleOperateShipment = async (labelValue: any, targetKey: any) => {
        const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
        const newPanes = tabList.filter((tab) => tab.key !== targetKey);
        setLoading(true);
        if (localDeliveryInfo[labelValue]) {
            const item = localDeliveryInfo[labelValue][0];
            if (item && item.id) {
                const result: API.Result = await deleteLocalDelivery({id: item.id});
                if (result.success) {
                    message.success('Success!!!');
                    if (newPanes.length && targetKey === activeKey) {
                        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                        setActiveKey(key);
                    }
                    setTabList(newPanes);
                    delete localDeliveryInfo[labelValue];
                } else {
                    message.error(result.message);
                }
            } else {
                message.error(`The batch ${labelValue} could not be found.`)
            }
        } else {
            if (newPanes.length && targetKey === activeKey) {
                const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                setActiveKey(key);
            }
            setTabList(newPanes);
            delete localDeliveryInfo[targetKey.toString()];
        }
        // TODO：判断剩余批次是否为0
        if (Object.keys(localDeliveryInfo).length === 0) {
            // 清空控件数据
            formRef?.current?.resetFields();
            await handleQueryLocalDeliveryInfo('delete');
        }
        setLoading(false);
    }

    const remove = (targetKey: TargetKey) => {
        const labelValue: any = tabList.find(item => item.key === targetKey)?.label;
        confirm({
            title: (<div> <strong>{labelValue}</strong> <br /> Are you sure delete this shipment ? </div>),
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // TODO：删除批次
                handleOperateShipment(labelValue, targetKey).then(r => console.log(r));
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

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                formRef={formRef}
                layout="vertical"
                name={'formJobInfo'}
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
                    />
                </ProCard>
            </ProForm>
        </Spin>
    )
}
export default LocalDelivery;