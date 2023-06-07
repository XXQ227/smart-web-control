import React from 'react';
import {Button, Col, Popconfirm, Row, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {getBranchID, getFuncCurrency, getUserID} from '@/utils/auths';
import {formatNumToMoney, ID_STRING, keepDecimal} from '@/utils/units';
import InputEdit from '@/components/InputNumberEdit'
import SearchModal from '@/components/SearchModal';
import {ProFormSelect} from '@ant-design/pro-components'

// TODO: 数据类型
type APICGTempItems = APIManager.CGTempItems;
type APIValue$Label = API.APIValue$Label;

interface Props {
    CGType: number,
    CGList: APICGTempItems[],
    form: any,
    formRef: any,
    formCurrent: any,
    FormItem: any,
    CurrencyList: APIValue$Label[],
    PayMethodList: APIValue$Label[],
    InvoTypeList: APIValue$Label[],
    label: string,
    // TODO: 保存
    handleCGTempChange: (data: any, CGType: number) => void,
}

const ChargeTemplateChargeTable: React.FC<Props> = (props) => {
    // @ts-ignore
    const {CGType, CGList, form, FormItem, label, CurrencyList, PayMethodList, InvoTypeList} = props;


    // const [CGListVO, setCGListVO] = useState<APICGTempItems[]>(CGList || []);

    const cgColumns: ColumnsType<APICGTempItems> = [
        {
            title: 'Charge Name',
            dataIndex: 'CGItemName',
            align: 'center',
            width: 200,
            render: (text: any, record, index) =>
                <FormItem
                    name={`CGItemID${record.ID}`}
                    initialValue={record.CGItemID}
                    rules={[{required: true, message: 'Charge Name'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        title={'Charge Name'}
                        value={record.CGItemID}
                        id={`CGItemID${record.ID}`}
                        url={'/api/MCommon/GetProCGItemByProID'}
                        query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.ID, 'CGItemID', val, option)}
                    />
                </FormItem>
        },
        {
            title: CGType === 1 ? 'Customer' : 'Payer',
            dataIndex: 'SettlementName',
            align: 'center',
            render: (text: any, record, index) =>
                <FormItem
                    name={`SettlementID${record.ID}`}
                    initialValue={record.SettlementID}
                    // rules={[{required: true, message: CGType === 1 ? 'Customer' : 'Payer'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        value={record.SettlementID}
                        id={`SettlementID${record.ID}`}
                        url={'/api/MCommon/GetCTNameByStrOrType'}
                        title={CGType === 1 ? 'Customer' : 'Payer'}
                        query={{
                            searchPayer: true, BusinessLineID: null,
                            UserID: getUserID(), CTType: 1, SystemID: 4,
                        }}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.ID, 'SettlementID', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit',
            dataIndex: 'CGUnitName',
            align: 'center',
            width: 140,
            render: (text: any, record, index) =>
                <FormItem
                    name={`CGUnitID${record.ID}`}
                    initialValue={record.CGUnitID}
                    rules={[{required: true, message: 'Unit'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        title={'Unit'}
                        value={record.CGUnitID}
                        id={`CGUnitID${record.ID}`}
                        query={{BranchID: getBranchID()}}
                        url={'/api/MCommon/GetCGUnitByStr'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.ID, 'CGUnitID', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'U. Price',
            dataIndex: 'UnitPrice',
            align: 'center',
            width: 100,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={text} name={`UnitPrice${record.ID}`}
                    rules={[{required: true, message: 'Unit Price'}]}
                >
                    <InputEdit
                        value={text} valueStr={record.UnitPriceStr}
                        id={`UnitPrice${record.ID}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.ID, 'UnitPrice', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Currency',
            dataIndex: 'CurrencyName',
            align: 'center',
            width: 80,
            render: (text: any, record: any, index) =>
                <ProFormSelect
                    required
                    placeholder={''}
                    options={CurrencyList}
                    name={`CurrencyID${record.ID}`}
                    initialValue={record.CurrencyID}
                    rules={[{required: true, message: 'Currency'}]}
                    fieldProps={{
                        dropdownMatchSelectWidth: false,
                        onSelect: (e) => handleRowChange(index, record.ID, 'CurrencyID', e)
                    }}
                />
        },
        {
            title: 'PayMethod',
            dataIndex: 'PayMethodID',
            align: 'center',
            width: 80,
            render: (text: any, record: any, index) =>
                <ProFormSelect
                    required
                    placeholder={''}
                    options={PayMethodList}
                    name={`PayMethodID${record.ID}`}
                    initialValue={record.PayMethodID}
                    rules={[{required: true, message: 'PayMethod'}]}
                    fieldProps={{
                        dropdownMatchSelectWidth: false,
                        onSelect: (e) => handleRowChange(index, record.ID, 'PayMethodID', e)
                    }}
                />
        },
        {
            title: 'Operate',
            align: 'center',
            width: 100,
            render: (_, record: any) =>
                <Popconfirm
                    onConfirm={() => handleDeleteCharge(record.ID)}
                    title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                >
                    <DeleteOutlined color={'red'}/>
                </Popconfirm>,
        },
    ];


    //region function 方法
    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @returns
     */
    const handleAdd = () => {
        const currLocalObj: APIValue$Label | undefined = CurrencyList?.find((x: APIValue$Label) => x.value === getFuncCurrency());
        const CGID = ID_STRING();
        const newDataObj: APICGTempItems = {
            ID: CGID,
            SettlementID: null,
            SettlementName: '',
            SettlementNameEN: '',
            CTName: '',
            CGItemID: null,
            CGItemName: '',
            SettlementType: 'f',
            SettlementTypeName: 'Regular',
            CGTypeID: CGType,
            CGUnitID: null,
            CGUnitName: '',
            UnitPrice: null,
            CurrencyID: currLocalObj?.value,
            InvoTypeID: InvoTypeList[0]?.value,
            PayMethodID: PayMethodList[0]?.value,
            ctCheck: false,
            TaxFree: false
        };
        const newData: APICGTempItems[] = [...CGList, newDataObj];
        // setCGListVO(newData);
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
        const target: any = newData.find((item: APICGTempItems) => item.ID === rowID) || {};

        const fileLen: number = filedName.length;
        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}${rowID}`]: target[filedName]};
        // TODO: 当录入【数量、单价】时，计算总价
        if (filedName === 'UnitPrice') {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 5));
        } else if (filedName === 'CurrencyID') {
        } else if (filedName.substring(fileLen-2, fileLen) === 'ID') {
            // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
            target[filedName.substring(0, fileLen-2) + 'Name'] = data?.label;
        }
        target.isChange = true;
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
        const newData: APICGTempItems[] = CGList.filter((item: APICGTempItems) => item.ID !== rowID) || [];
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
                    rowKey={'ID'}
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
export default ChargeTemplateChargeTable;