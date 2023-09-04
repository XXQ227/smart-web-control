import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Tabs} from 'antd';
import {ID_STRING, rowGrid} from '@/utils/units';
import {ProCard} from '@ant-design/pro-components';
import SearchSelectInput from '@/components/SearchSelectInput';
import FormItemTextArea from '@/components/FormItemComponents/FormItemTextArea'
import {PlusCircleOutlined} from '@ant-design/icons'
import ls from 'lodash'

interface Props {
    form: any;
    title: string;
    serviceInfo: any;
}


const BillOfLoading: React.FC<Props> = (props) => {
    const {form, serviceInfo} = props;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const initBillInfo: any = {
        jobId: serviceInfo.jobId, serviceId: serviceInfo.id,
        shipper: '', consignee: '', destinationAgent: '', notifyParty: '', alsoNotify: '',
    };

    const initialItems = [
        { label: 'Tab 1', children: 'Content of Tab 1', key: '1' },
    ];

    const [billOfLoadingEntityList, setBillOfLoadingEntityList] = useState<any[]>(serviceInfo.billOfLoadingEntity || []);
    const [activeKey, setActiveKey] = useState('1');
    const [billInfoItems, setBillInfoItems] = useState<any[]>(initialItems);

    useEffect(()=> {
        if (billOfLoadingEntityList?.length === 0) {
            setBillOfLoadingEntityList([{...initBillInfo, id: ID_STRING()}]);
        }
    }, [billOfLoadingEntityList?.length, initBillInfo]);


    const add = () => {
        const newActiveKey = `${billInfoItems.length + 1}`, newPanes = [...billInfoItems];
        newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
        setBillInfoItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey: any) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        billInfoItems.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = billInfoItems.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setBillInfoItems(newPanes);
        setActiveKey(newActiveKey);
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

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/7/26
     * @param filedName 操作的数据字段
     * @param val       修改的值
     * @param record    其他数据
     * @param option    其他数据
     * @param index    其他数据
     * @returns
     */
    const handleChange = (filedName: string, val: any, record: any, option?: any, index: number) => {
        const newData: any[] = ls.cloneDeep(billInfoItems);
        const target = newData.find((item: any)=> item.id === record.id) || {};
        target[filedName] = val?.target ? val.target.value : val;
        // TODO: 需要存箱型名字
        if (filedName === 'ctnModelId') {
            target.ctnModelName = option.label;
        }
        newData.splice(index, 1, target);
        // TODO: 把数据接口给到 FormItem 表单里
        // form.setFieldsValue({
        //     [`${filedName}_ctn_table_${target.id}`]: target[filedName],
        //     preBookingContainersEntityList: newData
        // });
        setBillOfLoadingEntityList(newData);
        // const setValueObj: any = {billOfLoadingEntity: {[filedName]: val}};
        // console.log(option);
        // form.setFieldsValue(setValueObj);
    }

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const handleAdd = () => {
        setBillOfLoadingEntityList((val: any) => [...val, initBillInfo]);
    };

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
                            handleChangeData={(val: any, option: any) => handleChange(fieldName, val, item, option, index)}
                        />
                    </Col>
                    <Col span={24}>
                        <FormItemTextArea
                            initialValue={valData}
                            rows={6} placeholder={''}
                            name={['billOfLoadingEntity', [fieldName + item.id]]}
                        />
                    </Col>
                </Row>
            </Col>
        );
    }
    //endregion

    console.log(billOfLoadingEntityList);
    return (
        <ProCard
            headerBordered
            title={props.title} bordered={true}
            className={'ant-card seaExportBillOfLoading'}
            extra={<Button icon={<PlusCircleOutlined/>} onClick={handleAdd}>Add</Button>}
        >
            {/*<Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={billInfoItems}
            />*/}
            {billOfLoadingEntityList?.length > 0 && billOfLoadingEntityList?.map((item: any, index)=>
                <Row key={item.id} gutter={rowGrid}>
                    {BlDOM('Shipper', 'shipper', item.shipper, item, index)}
                    {BlDOM('Consignee', 'consignee', item.consignee, item, index)}
                    {BlDOM('Destination Agent', 'destinationAgent', item.destinationAgent, item, index)}
                    {BlDOM('Notify Party', 'notifyParty', item.notifyParty, item, index)}
                    {BlDOM('Also Notify', 'alsoNotify', item.alsoNotify, item, index)}
                </Row>
            )}
        </ProCard>
    )
}
export default BillOfLoading;