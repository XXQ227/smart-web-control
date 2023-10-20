import React from 'react';
import {Button, Col, Popconfirm, Row, Space, Table, } from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {formatNumToMoney, ID_STRING} from '@/utils/units';
import InputEditNumber from '@/components/InputEditNumber'
import SearchModal from '@/components/SearchModal';
import FormItemSelect from '@/components/FormItemComponents/FormItemSelect'
import ls from 'lodash'

// TODO: 数据类型
type APICGTempItems = APIManager.CGTempItems;
type APIValue$Label = API.APIValue$Label;

interface Props {
    CGType: number,
    CGList: APICGTempItems[],
    chargeTemplateId: string,
    form: any,
    formRef: any,
    formCurrent: any,
    FormItem: any,
    CurrencyList: APIValue$Label[],
    PayMethodList: APIValue$Label[],
    label: string,
    // TODO: 保存
    handleCGTempChange: (data: any, CGType: number) => void,
}

const ChargeTemplateCharge: React.FC<Props> = (props) => {
    // @ts-ignore
    const {
        CGType, CGList, form, FormItem, label,
        CurrencyList, PayMethodList, chargeTemplateId
    } = props;


    //region function 方法
    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @returns
     */
    const handleAdd = () => {
        const currLocalObj: APIValue$Label | undefined = CurrencyList?.find((x: APIValue$Label) => x.value === 'HKD');
        const newDataObj: APICGTempItems = {
            id: ID_STRING(), chargeTemplateId, branchId: '0', type: CGType,
            currencyName: currLocalObj?.label,
        };
        const newData: APICGTempItems[] = ls.cloneDeep(CGList) || [];
        newData.push(newDataObj);
        props.handleCGTempChange(newData, CGType);
    }

    /**
     * @Description: TODO：费用行编辑
     * @author XXQ
     * @date 2023/4/10
     * @param index     费用索引行
     * @param rowID     费用行
     * @param filedName 当前操作字段
     * @param val       当前行结果
     * @param data      选中的数据集
     * @returns
     */
    function handleRowChange(index: number, rowID: any, filedName: string, val: any, data?: any) {
        const newData: APICGTempItems[] = CGList?.map((item: APICGTempItems) => ({...item})) || [];
        const target: any = newData.find((item: APICGTempItems) => item.id === rowID) || {};

        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}${rowID}`]: target[filedName]};
        if (['chargeItemId', 'unitType'].includes(filedName)) {
            setFieldsVal[`${filedName}${rowID}`] = data.label;
            const fileLen: number = filedName.length;
            if (filedName.substring(fileLen-2, fileLen) === 'id') {
                // TODO: 判断是不是 【id】 字段，【id】 字段需要存 【Name】 的值
                target[filedName.substring(0, fileLen-2) + 'Name'] = data?.label;
            }
        }
        // target.isChange = true;
        newData.splice(index, 1, target);
        form?.setFieldsValue(setFieldsVal);
        props.handleCGTempChange(newData, CGType);
        // setCGListVO(newData);
    }

    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @param rowID     费用行
     * @returns
     */
    function handleDeleteCharge(rowID: any) {
        const newData: APICGTempItems[] = CGList.filter((item: APICGTempItems) => item.id !== rowID) || [];
        // setCGListVO(newCGData);
        props.handleCGTempChange(newData, CGType);
    }

    /**
     * @Description: TODO: 复制费用
     * @author XXQ
     * @date 2023/4/10
     * @param state         复制成应收、应付
     * @returns
     */
    const handleCopy = (state: string) => {

    }
    // endregion

    const cgColumns: ColumnsType<APICGTempItems> = [
        {
            title: 'Charge Name',
            dataIndex: 'chargeItemName',
            align: 'center',
            width: 200,
            render: (text: any, record, index) =>
                <FormItem
                    name={`chargeItemId${record.id}`}
                    initialValue={record.chargeItemId}
                    rules={[{required: true, message: 'Charge Name'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        title={'Charge Name'}
                        value={record.chargeItemId}
                        id={`chargeItemId${record.id}`}
                        query={{branchId: 0}}
                        url={'/apiBase/chargeItem/queryChargeItemCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'chargeItemId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit',
            dataIndex: 'unitTypeName',
            align: 'center',
            width: 140,
            render: (text: any, record, index) =>
                <FormItem
                    name={`unitType${record.id}`}
                    initialValue={record.unitTypeName}
                    rules={[{required: true, message: 'Unit'}]}
                >
                    <SearchModal
                        qty={13}
                        title={'Unit'}
                        text={text}
                        value={record.unitType}
                        id={`unitType${record.id}`}
                        query={{branchId: 0, dictCode: 'charge_unit'}}
                        url={'/apiBase/dict/queryDictDetailCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'unitType', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'U. Price',
            dataIndex: 'unitPrice',
            align: 'center',
            width: 100,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={text} name={`unitPrice${record.id}`}
                    rules={[{required: true, message: 'Unit Price'}]}
                >
                    <InputEditNumber
                        value={text}
                        valueStr={formatNumToMoney(record.unitPrice)}
                        id={`UnitPrice${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'unitPrice', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Currency',
            dataIndex: 'currencyName',
            align: 'center',
            width: 60,
            render: (text: any, record: any, index) =>
                <FormItemSelect
                    required
                    options={CurrencyList}
                    id={`currencyName${record.id}`}
                    name={`currencyName${record.id}`}
                    initialValue={record.currencyName}
                    rules={[{required: true, message: 'Currency'}]}
                    onSelect={(e: any) => handleRowChange(index, record.id, 'currencyName', e)}
                />
        },
        {
            title: 'PayMethod',
            dataIndex: 'payMethod',
            align: 'center',
            width: 60,
            render: (text: any, record: any, index) =>
                <FormItemSelect
                    required
                    options={PayMethodList}
                    id={`PayMethodID${record.id}`}
                    name={`PayMethodID${record.id}`}
                    initialValue={record.payMethod}
                    rules={[{required: true, message: 'PayMethod'}]}
                    onSelect={(e: any) => handleRowChange(index, record.id, 'payMethod', e)}
                />
        },
        {
            title: 'Operate',
            align: 'center',
            width: 60,
            render: (_, record: any) =>
                <Popconfirm
                    onConfirm={() => handleDeleteCharge(record.id)}
                    title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                >
                    <DeleteOutlined color={'red'}/>
                </Popconfirm>,
        },
    ];

    //region render
    const renderTableTitle = (
        <div className={'ant-table-title-info'}>
            <div className={'ant-div-left'}>
                <span className={'ant-table-title-label'}>{label}</span>
                <Space>
                    <Button onClick={() => handleCopy('same')}>Copy</Button>
                    <Button onClick={() => handleCopy('noSame')}>Copy to {CGType === 1 ? 'AP' : 'AR'}</Button>
                </Space>
            </div>
        </div>
    );
    // endregion

    return (
        <Row gutter={24}>
            <Col span={24}>
                <Table
                    rowKey={'id'}
                    bordered={true}
                    pagination={false}
                    columns={cgColumns}
                    dataSource={CGList}
                    title={() => renderTableTitle}
                    locale={{emptyText: "NO DATA"}}
                    className={'ant-pro-table-charge-info ant-pro-table-edit'}
                />
            </Col>
            <Col span={24}>
                <Button icon={<PlusOutlined/>} onClick={handleAdd} className={'ant-btn-charge-add'}>Add Charge</Button>
            </Col>
        </Row>
    )

}
export default ChargeTemplateCharge;