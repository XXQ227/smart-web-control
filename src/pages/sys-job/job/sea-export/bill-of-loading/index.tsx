import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, message, Modal, Row, Tabs} from 'antd';
import type {TabsProps} from 'antd';
import {ID_STRING, rowGrid} from '@/utils/units';
import {ProCard, ProFormList, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import type { FormListActionType } from "@ant-design/pro-components";
import SearchSelectInput from '@/components/SearchSelectInput';
import {ExclamationCircleFilled, PlusCircleOutlined} from '@ant-design/icons'
import {useModel} from "@@/plugin-model/useModel";

interface Props {
    form: any;
    formRef: any;
    title: string;
    serviceInfo: any;
    isSave: boolean;
    state?: string;
}
const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const BillOfLoading: React.FC<Props> = (props) => {
    const {form, formRef, serviceInfo, isSave, state} = props;
    const actionRef = useRef<FormListActionType<{name: string;}>>();
    const [loading, setLoading] = useState(false);

    const {
        deleteBillOfLoading
    } = useModel('job.job', (res: any) => ({
        deleteBillOfLoading: res.deleteBillOfLoading,
    }));

    const [billOfLoadingEntityList, setBillOfLoadingEntityList] = useState<any>({});
    const initialItems: TabsProps['items'] = [];
    const [billInfoItems, setBillInfoItems] = useState<any[]>(initialItems);
    const [activeKey, setActiveKey] = useState<string>('1');
    const activeKeyRef = useRef(activeKey);
    activeKeyRef.current = activeKey;
    const newTabIndex = useRef(1);
    const billOfLoadingQTY = useRef(0);
    billOfLoadingQTY.current = Object.keys(billOfLoadingEntityList).length;
    const [firstLabelName, setFirstLabelName] = useState<string>('');
    const initBillInfo: any = {
        jobId: serviceInfo.jobId, serviceId: serviceInfo.id, id: ID_STRING(),
        shipper: '', consignee: '', destinationAgent: '', notifyParty: '', alsoNotify: '',
    };

    useEffect(() => {
        if (!isSave) {
            setBillInfoItems([]);
        }
    }, [isSave]);

    const BlDOM = (label: string, fieldName: string, valData: string, item: any, index: number) => {
        return (
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                <Row gutter={24} className={'ant-form-shipperInfoItem'}>
                    <Col span={6}>{label}</Col>
                    <Col span={18}>
                        <SearchSelectInput
                            qty={5}
                            id={`SearchInput${label}`}
                            filedValue={'id'} filedLabel={'nameFullEn'}
                            query={{branchId: '1665596906844135426', buType: 1}}
                            url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                            handleChangeData={(val: any, option: any) => handleSearchChange(fieldName, val, item, option, index)}
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            placeholder=''
                            name={fieldName}
                            fieldProps={{rows: 6}}
                        />
                    </Col>
                </Row>
            </Col>
        );
    }

    /**
     * @Description: TODO: 当修改提单号时，同时修改选项卡头显示的文字
     * @author LLS
     * @date 2023/9/6
     * @returns
     */
    const handleChangeLabel = (value: any) => {
        let labelName = value;
        if (!value) {
            labelName = 'New Tab';
        }
        setBillInfoItems(prevTabList => {
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
     * @date 2023/9/5
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
            {(f, index) => {
                return (
                    <>
                        <Row gutter={rowGrid}>
                            {BlDOM('Shipper', 'shipper', data.shipper, data, index)}
                            {BlDOM('Consignee', 'consignee', data.consignee, data, index)}
                            {BlDOM('Destination Agent', 'destinationAgent', data.destinationAgent, data, index)}
                            {BlDOM('Notify Party', 'notifyParty', data.notifyParty, data, index)}
                            {BlDOM('Also Notify', 'alsoNotify', data.alsoNotify, data, index)}
                            {
                                billOfLoadingQTY.current > 1 ?
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8}>
                                        <Row gutter={24} className={'ant-form-shipperInfoItem'}>
                                            <Col span={6}>MB/L No.</Col>
                                            <Col span={18}>
                                                <ProFormText
                                                    required
                                                    name="blNum"
                                                    placeholder=""
                                                    rules={[{required: true, message: 'MB/L No.'}]}
                                                    fieldProps={{
                                                        onChange: (val: any) => handleChangeLabel(val.target.value)
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col> : null
                            }
                        </Row>
                    </>
                );
            }}
        </ProFormList>
    }

    useEffect(()=> {
        // TODO：当后台传回来的收发通信息是空并且billOfLoadingQTY.current的值为0时，创建一条空的收发通信息
        if (serviceInfo?.billOfLoadingEntity?.length === 0 && billOfLoadingQTY.current === 0) {
            setBillOfLoadingEntityList({['1']: [{...initBillInfo, blNum: form?.getFieldValue('mblNum')}]});
            setBillInfoItems([
                {
                    label: form?.getFieldValue('mblNum'),
                    key: '1',
                    closable: true,
                    children: renderContent('1', {['1']: [{...initBillInfo, blNum: form?.getFieldValue('mblNum')}]}),
                },
            ]);
            setFirstLabelName('1');
            newTabIndex.current = 2;
        } else if (serviceInfo?.billOfLoadingEntity?.length > 0) {
            // TODO：当后台传回来的收发通信息的长度不等于0时，对收发通信息进行数据转化
            const resultData = {};
            serviceInfo?.billOfLoadingEntity.forEach((item: any) => {
                let key = item.blNum
                let suffix = 'A';
                // 检查是否已经存在相同的 key
                while (resultData[key]) {
                    key = item.blNum + suffix;
                    suffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
                }
                if (!resultData[key]) {
                    resultData[key] = [];
                }
                // TODO: 当表单中有对应的key收发通信息时，判断表单中对应key的收发通信息id和后台获取的key收发通信息id是否一致，不一致时设置为后台获取的key收发通信息
                if (formRef?.current?.getFieldValue(key) && formRef?.current?.getFieldValue(key)[0].id !== item.id) {
                    formRef?.current?.setFieldsValue({[key]: [item]});
                }
                resultData[key].push(item);
            });
            const newTabList: TabsProps['items'] = Object.entries(resultData).map(([key], index) => ({
                label: key,
                key: (index + 1).toString(),
                closable: true,
                children: renderContent(key, resultData),
            }));
            newTabIndex.current = newTabList.length + 1;
            setBillOfLoadingEntityList(resultData);
            setBillInfoItems(newTabList);
            // TODO: 保存后，如果当前激活tab面板的key值大于后台获取提单信息数据长度，需要重新设置当前激活tab面板的key
            if (state === 'add' && Number(activeKey) >  Number(newTabList.length.toString())) {
                setActiveKey(newTabList.length.toString());
            }
            // TODO: 当提单信息只有一条的时候需要给 firstLabelName 赋值，作用是为了正常显示界面
            if (serviceInfo?.billOfLoadingEntity?.length === 1) {
                setFirstLabelName(serviceInfo?.billOfLoadingEntity[0].blNum)
            }
        }
    }, [serviceInfo?.billOfLoadingEntity, state]);

    function handleSearchChange(filedName: string, val: any, record: any, index: number, option?: any){

    }

    /**
     * @Description: TODO: 新增页签
     * @author LLS
     * @date 2023/9/7
     * @returns
     */
    const add = () => {
        if (form?.getFieldValue('mblNum')) {
            let missingLabelName = '';
            const prefix = form?.getFieldValue('mblNum');
            const keys = Object.keys(billOfLoadingEntityList);
            let id = '';
            function checkLabel(labelName: string) {
                let missingLabel: string = '';
                if (!billInfoItems.some(item => item.label === labelName)) {
                    missingLabel = labelName;
                }
                return missingLabel;
            }
            // 自动生成标签并检查它们，循环调用 checkLabel 方法并输出缺失的标签
            for (let i = 0; i < 26; i++) {
                const label = `${prefix}${String.fromCharCode(65 + i)}`; // 使用字符编码生成后缀字母
                const missingLabel = checkLabel(label);
                if (missingLabel) {
                    if (billOfLoadingQTY.current === 1 && keys.length === 1) {
                        const key = keys[0];
                        id = billOfLoadingEntityList[key][0].id;
                        missingLabelName = id?.indexOf('ID_') > -1 ? `${prefix}B` : missingLabel;
                    } else {
                        missingLabelName = missingLabel;
                    }
                    break; // 如果找到一个缺失的标签，停止循环
                }
            }

            const newActiveKey: string= (newTabIndex.current++).toString();
            const newBillOfLoadingEntityList = {
                ...billOfLoadingEntityList,
                [newActiveKey]: [{...initBillInfo, blNum: missingLabelName}]
            }
            setBillOfLoadingEntityList(newBillOfLoadingEntityList);
            // TODO: 如果获取到当前要创建的name数据，就设置这个name的数据为初始值（之前用过相同的newActiveKey值创建过，再次用这个值就会出问题）
            if (formRef?.current?.getFieldValue(newActiveKey)) {
                formRef?.current?.setFieldsValue({[newActiveKey]: [{...initBillInfo, blNum: missingLabelName}]});
            }
            setBillInfoItems(prevTabList =>  {
                const updatedTabList = [...prevTabList];
                // TODO: 如果在新增页签时，当前的收发通信息只有一条信息，需要更新一下选项卡头显示的内容，不然之前的信息里无法显示提单号
                if (billOfLoadingQTY.current === 1 && keys.length === 1) {
                    const activeTab = updatedTabList.find(tab => tab.key === activeKeyRef.current);
                    const key = keys[0];
                    // TODO: 新增一条把之前的信息blNum改为`${prefix}A`
                    if (id?.indexOf('ID_') > -1) {
                        activeTab.label = `${prefix}A`;
                        const currentValues = formRef.current?.getFieldsValue();
                        // 使用 setFieldsValue 更新表单字段
                        formRef.current?.setFieldsValue({
                            ...currentValues,
                            [key]: [
                                {
                                    ...currentValues[key][0], // 保留对象中的其他属性
                                    blNum: `${prefix}A`, // 更新 blNum
                                },
                            ],
                        });
                    }
                    activeTab.children = renderContent(id?.indexOf('ID_') > -1 ? activeTab.key : firstLabelName, billOfLoadingEntityList);
                }
                return [
                    ...prevTabList,
                    {
                        label: missingLabelName,
                        key: newActiveKey,
                        closable: true,
                        children: renderContent(newActiveKey, newBillOfLoadingEntityList),
                    },
                ]
            });
            setActiveKey(newActiveKey);
        }
    };

    /**
     * @Description: TODO: 删除收发通信息
     * @author LLS
     * @date 2023/9/7
     * @param labelValue
     * @param targetKey
     */
    const handleOperateBillOfLoading = async (labelValue: any, targetKey: any) => {
        setLoading(true);
        try {
            const targetIndex = billInfoItems.findIndex((pane) => pane.key === targetKey);
            const newPanes = billInfoItems.filter((tab) => tab.key !== targetKey);
            const delPanes = billInfoItems.filter((tab) => tab.key === targetKey)[0]?.children;
            // @ts-ignore
            const delPanesId = delPanes?.props?.initialValue[0]?.id;
            // TODO：判断要删除的收发通信息是否是新增的
            if (delPanesId?.indexOf('ID_') === -1) {
                const result: API.Result = await deleteBillOfLoading({id: delPanesId});
                if (result.success) {
                    message.success('Success!!!');
                    // TODO：当剩余的选项卡的长度 !== 0以及当前要删除的tab面板key等于当前激活tab面板的key时，设置当前激活tab面板的key为剩余选项卡的最后一位
                    if (newPanes.length && targetKey === activeKey) {
                        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                        setActiveKey(key);
                    }
                    setBillInfoItems(newPanes);
                    // TODO：定义一个函数来删除对象
                    function deleteItemById(targetId: string, data: any, key: any) {
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id === targetId) {
                                delete billOfLoadingEntityList[key]; // 删除匹配的对象
                                break; // 结束循环，因为已经找到并删除了对象
                            }
                        }
                    }
                    for (const key in billOfLoadingEntityList) {
                        if (Array.isArray(billOfLoadingEntityList[key])) {
                            deleteItemById(delPanesId, billOfLoadingEntityList[key], key);
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
                setBillInfoItems(newPanes);
                delete billOfLoadingEntityList[targetKey.toString()];
            }
            if (Object.keys(billOfLoadingEntityList).length === 1) {
                setFirstLabelName(Object.keys(billOfLoadingEntityList).join(', '));
                // TODO: 如果在删除页签时，剩下的收发通信息只有一条信息，需要更新一下选项卡显示的内容，不然布局里会显示提单号
                setBillInfoItems(prevTabList => {
                    const updatedTabList = [...prevTabList];
                    const activeTab = updatedTabList.find(tab => tab.key !== targetKey);
                    if (activeTab) {
                        activeTab.children = renderContent(Object.keys(billOfLoadingEntityList).join(', '), billOfLoadingEntityList);
                    }
                    return updatedTabList;
                });
            }
        } catch (e) {
            message.error(e);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 删除收发通信息
     * @author LLS
     * @date 2023/9/5
     * @param targetKey
     */
    const remove = (targetKey: TargetKey) => {
        const labelValue: any = billInfoItems.find(item => item.key === targetKey)?.label;
        confirm({
            title: (<div> <strong>{labelValue}</strong> <br /> Are you sure delete this Bill Of Loading ? </div>),
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                // TODO：删除收发通信息
                handleOperateBillOfLoading(labelValue, targetKey).then(r => console.log(r));
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
            add();
        } else {
            remove(targetKey);
        }
    };

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };
    //endregion

    return (
        <ProCard
            loading={loading}
            headerBordered
            title={props.title} bordered={true}
            className={'ant-card seaExportBillOfLoading'}
            extra={
                <Button
                    hidden={billOfLoadingQTY.current > 1 || !form?.getFieldValue('mblNum')}
                    icon={<PlusCircleOutlined/>}
                    onClick={add}
                >
                    Add
                </Button>
            }
        >
            <Tabs
                className={billOfLoadingQTY.current === 1 && firstLabelName ? 'tabs-header-hide' : 'tabs-header-show'}
                type="editable-card"
                activeKey={activeKey}
                onChange={handleTabChange}
                onEdit={onEdit}
                items={billInfoItems}
            />

            {/* // TODO: 用于保存时，获取数据用 */}
            <ProFormText hidden={true} name={'billOfLoadingEntity'}/>
        </ProCard>
    )
}
export default BillOfLoading;