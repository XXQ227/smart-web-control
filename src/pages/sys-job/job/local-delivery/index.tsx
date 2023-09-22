import React, {useState, useRef} from 'react';
import BasicInfo from './basicInfo';
import {Modal, Tabs, Spin, Button, message, Form} from "antd";
import type {TabsProps} from 'antd';
import '../style.less';
import type { FormListActionType, ProFormInstance } from "@ant-design/pro-components";
import {
    ProFormList,
    FooterToolbar,
    ProForm,
    ProCard
} from "@ant-design/pro-components";
import {ExclamationCircleFilled, LeftOutlined, SaveOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {getFormErrorMsg} from "@/utils/units";
import {useParams, useModel} from "umi";

interface Props {
    type: string,
    handleChangeTabs: (value: string) => void,
    handleChangedTabName: (value: string) => void,
}

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const LocalDelivery: React.FC<Props> = (props) => {
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

    const [localDeliveryInfo, setLocalDeliveryInfo] = useState<any>({});
    const initialTabList: TabsProps['items'] = [];
    const [tabList, setTabList] = useState(initialTabList);
    const [activeKey, setActiveKey] = useState<string>('1');
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(1);
    const [isChange, setIsChange] = useState(false);

    /**
     * @Description: TODO: 当修改批次名称时，同时修改选项卡头显示的文字
     * @author LLS
     * @date 2023/8/28
     * @returns
     */
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

    /**
     * @Description: TODO: 选项卡头显示的内容
     * @author LLS
     * @date 2023/8/25
     * @returns
     */
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

    /**
     * @Description: TODO: 新增页签
     * @author LLS
     * @date 2023/8/25
     * @returns
     */
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
                    const newTabList: TabsProps['items'] = Object.entries(resultData).map(([key], index) => ({
                        label: key,
                        key: (index + 1).toString(),
                        closable: true,
                        children: renderContent(key, resultData),
                    }));
                    newTabIndex.current = newTabList.length + 1;
                    setLocalDeliveryInfo(resultData);
                    setTabList(newTabList);
                    // TODO: 保存后，如果当前激活tab面板的key值大于后台获取地交付服务信息数据长度，需要重新设置当前激活tab面板的key
                    if (state === 'add' && Number(activeKey) >  Number(newTabList.length.toString())) {
                        setActiveKey(newTabList.length.toString());
                    }
                    // TODO: 把当前服务的 id 存下来
                    setId(result.data.id);
                } else {
                    // TODO: 如果没有批次数据，新增页签
                    handleAddBatch();
                    setId('0');
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
            // TODO: 将数据转化成保存的格式
            const dataWithJobId = [];
            for (const shipmentNum in val) {
                if (val.hasOwnProperty(shipmentNum)) {
                    dataWithJobId.push(...val[shipmentNum].map((item: any) => ({
                        ...item,
                        jobId
                    })));
                }
            }
            function removeTableProperties(obj: any): any {
                let serviceId = '0';

                function mapContainerItem(item: any) {
                    return {
                        ...item,
                        id: item.id.indexOf('ID_') > -1 ? '0' : item.id,
                        jobId,
                        serviceId,
                    };
                }

                function mapPhotoRemarkItem(item: any) {
                    return {
                        ...item,
                        id: item.id.indexOf('ID_') > -1 ? '0' : item.id,
                        jobId,
                        localDeliveryServiceId: serviceId,
                    };
                }

                // TODO: id属性不存在时，添加id属性值为'0'；存在就赋值给serviceId
                if (!obj.hasOwnProperty('id')) {
                    obj.id = '0';
                } else {
                    serviceId = obj.id;
                }

                for (const prop in obj) {
                    // TODO: 删除对应的 table 里的录入数据
                    if (prop.includes('_table_')) {
                        delete obj[prop];
                    } else if (typeof obj[prop] === 'object') {
                        // TODO: 处理箱信息的 id 数据
                        if (prop === 'preBookingContainersEntityList') {
                            if (obj[prop]?.length > 0) {
                                obj[prop] = obj[prop].map(mapContainerItem);
                            }
                        } else if (prop === 'photoRemarkEntityList') {
                            if (obj[prop]?.length > 0) {
                                obj[prop] = obj[prop].map(mapPhotoRemarkItem);
                            }
                        }
                    }
                }
                return obj;
            }
            const cleanedDataWithJobId = dataWithJobId.map((data) => {
                return removeTableProperties(data);
            });

            let result: API.Result;
            if (id === '0') {
                result = await addLocalDelivery(cleanedDataWithJobId);
            } else {
                result = await editLocalDelivery(cleanedDataWithJobId);
            }
            if (result.success) {
                message.success('Success!!!');
                if (id === '0') {
                    props.handleChangeTabs(props.type);
                }
                // TODO: 把当前服务的 id 存下来
                setId(result.data.id);
                setTabList([]);
                // 清空控件数据
                formRef?.current?.resetFields();
                await handleQueryLocalDeliveryInfo('add');
                props.handleChangedTabName('');
                setIsChange(false);
            } else {
                message.error(result.message);
            }
        } catch (errorInfo) {
            console.log(errorInfo);
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
        setLoading(true);
        try {
            const targetIndex = tabList.findIndex((pane) => pane.key === targetKey);
            const newPanes = tabList.filter((tab) => tab.key !== targetKey);
            const delPanes = tabList.filter((tab) => tab.key === targetKey)[0]?.children;
            // @ts-ignore
            const delPanesId = delPanes?.props?.initialValue[0]?.id;
            // TODO：判断要删除的批次是否是新增的
            if (delPanesId) {
                const result: API.Result = await deleteLocalDelivery({id: delPanesId});
                if (result.success) {
                    message.success('Success!!!');
                    // TODO：当剩余的选项卡的长度 !== 0以及当前要删除的tab面板key等于当前激活tab面板的key时，设置当前激活tab面板的key为剩余选项卡的最后一位
                    if (newPanes.length && targetKey === activeKey) {
                        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                        setActiveKey(key);
                    }
                    setTabList(newPanes);
                    // TODO：定义一个函数来删除对象
                    function deleteItemById(targetId: string, data: any, key: any) {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id === targetId) {
                                delete localDeliveryInfo[key]; // 删除匹配的对象
                                break; // 结束循环，因为已经找到并删除了对象
                            }
                        }
                    }
                    for (const key in localDeliveryInfo) {
                        if (Array.isArray(localDeliveryInfo[key])) {
                            deleteItemById(delPanesId, localDeliveryInfo[key], key);
                        }
                    }
                } else {
                    message.error(result.message);
                }
            } else {
                // TODO：当剩余的选项卡的长度 !== 0以及当前要删除的tab面板key等于当前激活tab面板的key时，设置当前激活tab面板的key为剩余选项卡的最后一位
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
        } catch (e) {
            message.error(e)
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

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author LLS
     * @date 2023/9/22
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    const handleProFormValueChange = (changeValues: any) => {
        if (changeValues) {
            props.handleChangedTabName('Local Delivery');
            setIsChange(true);
        }
    }

    /**
     * @Description: TODO: 返回
     * @author LLS
     * @date 2023/9/22
     * @returns
     */
    const handleBack = () => {
        if (isChange) {
            confirm({
                title: `Confirm return ?`,
                content: 'The current information has been modified.',
                icon: <ExclamationCircleFilled />,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    history.push({pathname: '/job/job-list'});
                }
            });
        } else {
            history.push({pathname: '/job/job-list'});
        }
    }

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
                            extra={<Button icon={<LeftOutlined/>} onClick={handleBack}>Back</Button>}>
                            <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'}
                                    htmlType={'submit'}>Save</Button>
                        </FooterToolbar>
                }}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
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