import React, {useState} from 'react';
import {Button, Col, Divider, message, Popconfirm, Row, Select, Space} from 'antd';
import {DeleteOutlined, PlusOutlined, FormOutlined} from '@ant-design/icons';
import {formatNumToMoney, ID_STRING, keepDecimal} from '@/utils/units';
import InputEditNumber from '@/components/InputEditNumber'
import {CHARGE_STATE_ENUM} from '@/utils/enum'
import SearchModal from '@/components/SearchModal';
import {ProCard, ProFormText, ProTable} from "@ant-design/pro-components";
import type {ProColumns} from '@ant-design/pro-table';
import {useModel} from '@@/plugin-model/useModel'
import {Remark} from '@/pages/sys-job/job/charge/remark'
import {renderAmountByCurrency} from '@/pages/sys-job/job/charge/chargeTable'

const Option = Select.Option;
// TODO: 数据类型
type APICGInfo = APIModel.PRCGInfo;

interface Props {
    CGType: number,
    jobId: string,
    CGList: APICGInfo[],
    form: any,
    FormItem: any,
    InvoTypeList: any[],
    // TODO: 保存
    handleChangeData: (data: any, CGType: number) => void,
    handleChangeRows: (selectRowKeys: any[], rows: any[], key: string) => void,
}


const Agent: React.FC<Props> = (props) => {
    const {CGType, jobId, CGList, form, FormItem, InvoTypeList} = props;
    const CurrencyOpts = ['CNY', 'HKD', 'USD'];
    const {jobInfo} = useModel('job.job', (res: any) => ({jobInfo: res.jobInfo}));
    const {deleteCharges} = useModel('job.jobCharge', (res: any) => ({deleteCharges: res.deleteCharges}));

    const [cgList, setCGList] = useState<APICGInfo[]>(CGList || []);

    // TODO: 备注弹框
    const [open, setOpen] = useState<boolean>(false);
    // TODO: 选中的费用行
    const [chargeRecord, setChargeRecord] = useState<any>({});
    const [chargeIndex, setChargeIndex] = useState<number>(0);

    // TODO: 复选框
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);

    const handleChangeData = (data: any) => {
        props.handleChangeData(data, CGType);
    }

    const handleChangeRows = (selectRowKeys: any[], rows: any[]) => {
        props.handleChangeRows(selectRowKeys, rows, 'agentSelected');
    }

    //region function 方法
    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @returns
     */
    const handleAdd = () => {
        const invoTypeObj: any = InvoTypeList[0];
        const newDataObj: APICGInfo = {
            jobId,
            jobCode: jobInfo.code,
            branchId: '1665596906844135426',
            businessId: '',
            businessName: '',
            businessOracleId: '',
            id: '',
            itemId: '',
            itemName: '',
            itemSubjectCode: '',
            unitId: '',
            unitName: '',
            invoiceTypeId: invoTypeObj.value,
            invoiceTypeName: invoTypeObj.label,
            vatRate: 0,
            taxFreeFlag: 1,
            supplementFlag: 0,
            settlementType: 0,
            type: CGType,
            state: 1,
            orgCurrencyName: '',
            orgUnitPrice: 0,
            orgUnitPriceStr: '',
            orgAmount: 0,
            orgAmountStr: '',
            orgBillExrate: 0,
            orgBillExrateStr: '',
            qty: '',
            qtyStr: '',
            billCurrencyName: '',
            billUnitPrice: 0,
            billInTaxAmount: 0,
            billNoTaxAmount: 0,
            billTaxAmount: 0,
            billWriteOffAmount: 0,
            billFuncExrate: 0,
            invoiceBillFuncExrate: 0,
            funcAmountInTax: 0,
            funcNoTaxAmount: 0,
            funcTaxAmount: 0,
            bmsUploadStatus: 0,
            payMethod: 1,
            departmentCode: 1,
            salespersonCode: 1,
            operatorCode: 1,
            remark: 'test',

            // TODO: 代收对象
            receiveId: 'ar_' + ID_STRING(),
            receiveBusinessId: '',
            receiveBusinessName: '',
            receiveBusinessOracleId: '',
            receiveBillCurrencyName: '',
            receiveOrgBillExrate: 0,
            receiveOrgBillExrateStr: '',
            receiveBillUnitPrice: 0,
            receiveBillInTaxAmount: 0,
            receiveBillInTaxAmountStr: '',

            // TODO: 代付对象
            payId: '',
            payBusinessId: '',
            payBusinessName: '',
            payBusinessOracleId: '',
            payBillCurrencyName: '',
            payOrgBillExrate: 1,
            payOrgBillExrateStr: '',
            payBillUnitPrice: 0,
            payBillInTaxAmount: 0,
            payBillInTaxAmountStr: '',
        };
        const newData: APICGInfo[] = [...cgList, newDataObj];
        setCGList(newData);
        handleChangeData(newData);
    }

    /**
     * @Description: TODO: 复制费用
     * @author XXQ
     * @date 2023/4/10
     * @returns
     */
    const handleCopy = () => {
        const newData: any[] = cgList.slice(0);
        let selectArr: any[] = selectRows.slice(0);
        selectArr = selectArr.map((item: any, index: number) => ({
            ...item, id: ID_STRING() + index,
            state: 1, remark: '',
        }));
        newData.push(...selectArr);
        setCGList(newData);
        form?.setFieldsValue({reimbursementChargeList: newData});
        handleChangeData(newData);
        message.success('success');
        handleClearSelected();
    }

    function handleClearSelected() {
        // TODO: 清空选中的数据
        setSelectRows([]);
        setSelectedKeys([]);
        handleChangeRows([], []);
    }

    /**
     * @Description: TODO：费用行编辑
     * @author XXQ
     * @date 2023/4/10
     * @param index     费用索引行
     * @param record    费用行
     * @param filedName 当前操作字段
     * @param val       当前行结果
     * @param data      选中的数据集
     * @returns
     */
    function handleRowChange(index: number, record: any, filedName: string, val: any, data?: any) {
        const newData: APICGInfo[] = cgList?.map((item: APICGInfo) => ({...item})) || [];
        const target: any = newData.find((item: APICGInfo) => item.receiveId === record.receiveId) || {};

        const nameStr: string = `_table_${record.receiveId}`;

        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = ['qty', 'orgUnitPrice', 'receiveOrgBillExrate', 'payOrgBillExrate'].includes(filedName)
            ? Number(val) || null : val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}${nameStr}`]: target[filedName]};
        // TODO: 当录入【数量、单价】时，计算总价
        if (['qty', 'orgUnitPrice', 'receiveOrgBillExrate', 'payOrgBillExrate'].includes(filedName)) {
            const isRate = ['receiveOrgBillExrate', 'payOrgBillExrate'].includes(filedName);
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], isRate ? 7 : 5));
            if (['qty', 'orgUnitPrice'].includes(filedName) && target.qty && target.orgUnitPrice) {
                target.orgAmount = keepDecimal(target.qty * target.orgUnitPrice);
                target.orgAmountStr = formatNumToMoney(target.orgAmount);
            }
        } else if (filedName === 'receiveBusinessId') {
            target.receiveBusinessName = data.nameFullEn;
            target.receiveBusinessOracleId = data.oracleCustomerCode || '123456';
        } else if (filedName === 'payBusinessId') {
            target.payBusinessName = data.nameFullEn;
            target.payBusinessOracleId = data.oracleCustomerCode || '123456';
        } else if (filedName === 'itemId') {
            target.itemName = data.label;
            target.itemSubjectCode = CGType === 1 ? data.subjectCodeAr : data.subjectCodeAp;
        } else if (filedName === 'unitId') {
            target.unitName = data.label;
        } else if (['orgCurrencyName', 'receiveBillCurrencyName', 'payBillCurrencyName'].includes(filedName)) {
            if (filedName === 'orgCurrencyName') {
                // TODO: 账单币种跟着原币走
                target.receiveBillCurrencyName = val;
                target.payBillCurrencyName = val;
                setFieldsVal[`receiveBillCurrencyName${nameStr}`] = val;
                setFieldsVal[`payBillCurrencyName${nameStr}`] = val;
                // TODO: 更新原币到账单币种的汇率
                setFieldsVal[`receiveOrgBillExrate${nameStr}`] = target.receiveOrgBillExrate = data?.exRate || 1;
                target.receiveOrgBillExrateStr = formatNumToMoney(keepDecimal(target.receiveOrgBillExrate, 7));

                setFieldsVal[`payOrgBillExrate${nameStr}`] = target.payOrgBillExrate = data?.exRate || 1;
                target.payOrgBillExrateStr = formatNumToMoney(keepDecimal(target.payOrgBillExrate, 7));

                // TODO: 计算代收代付的账单金额
                target.payBillUnitPrice = target.receiveBillUnitPrice = target.orgUnitPrice;
                target.receiveBillInTaxAmount = target.payBillInTaxAmount = target.orgAmount;
                target.receiveBillInTaxAmountStr = target.payBillInTaxAmountStr = target.orgAmountStr;
            }
        } else if (filedName === 'remark') {
            setChargeRecord({});
            setChargeIndex(0);
            setOpen(false);
        }
        if (target.orgUnitPrice && target.orgBillExrate) {
            target.billUnitPrice = target.orgUnitPrice * target.orgBillExrate;
        }
        if (target.orgAmount && target.orgBillExrate) {
            target.billInTaxAmount = target.orgAmount * target.orgBillExrate;
        }
        newData.splice(index, 1, target);
        setFieldsVal.reimbursementChargeList = newData;
        form?.setFieldsValue(setFieldsVal);
        setCGList(newData);
        handleChangeData(newData);
    }

    const handleEditRemark = (index: number, record: any) => {
        setChargeRecord(record);
        setChargeIndex(index);
        setOpen(true);
    }

    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @param rowID     费用行
     * @returns
     */
    function handleDeleteCharge(rowID: any) {
        const newCGData: APICGInfo[] = cgList.filter((item: APICGInfo) => item.receiveId !== rowID) || [];
        setCGList(newCGData);
        handleChangeData(newCGData);
    }

    // TODO: 删除费用
    const handleRemove = async () => {
        if (selectedKeys?.length > 0) {
            const rowKeys: React.Key[] = selectedKeys?.filter((key: string)=> key.indexOf('ID_') === -1) || [];

            let result: API.Result = {success: true};
            if (rowKeys) {
                result = await deleteCharges({jobId, idList: rowKeys});
            }
            if (result.success) {
                let chargeArr: any[] = cgList.slice(0);
                chargeArr = chargeArr.filter((item: any) => !selectedKeys.includes(item.id)) || [];
                setCGList(chargeArr);
                handleClearSelected();
                message.success('success');
            } else {
                message.error(result.message);
            }
        }
    }
    //endregion

    //region
    const renderTableTitle = (
        <div className={'ant-table-title-info'}>
            <div className={'ant-div-left'}>
                {/*<span className={'ant-table-title-label'}>AR</span>*/}
                <Space>
                    <Button disabled={selectedKeys?.length === 0} onClick={() => handleRemove()}>Remove</Button>
                    <Button disabled={selectedKeys?.length === 0} onClick={() => handleCopy()}>Copy</Button>
                </Space>
            </div>
        </div>
    )
    // endregion


    const columns: ProColumns<APICGInfo>[] = [
        {
            title: 'Description', dataIndex: 'itemName', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.itemId}
                    name={`itemId_table_${record.receiveId}`}
                    rules={[{required: true, message: 'Description'}]}
                >
                    <SearchModal
                        qty={13}
                        text={record.itemName}
                        title={'Description'}
                        value={record.itemId}
                        id={`itemId${record.receiveId}`}
                        query={{branchId: '1665596906844135426'}}
                        url={'/apiBase/chargeItem/queryChargeItemCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'itemId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Payer', dataIndex: 'receiveBusinessName', align: 'center',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Payer`}]}
                    name={`receiveBusinessId_table_${record.receiveId}`} initialValue={record.receiveBusinessId}
                >
                    <SearchModal
                        qty={13}
                        title={'Payer'}
                        value={record.receiveBusinessId}
                        text={record.receiveBusinessName}
                        query={{branchId: '1665596906844135426'}}
                        id={`receiveBusinessId${record.receiveId}`}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'receiveBusinessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Vendor', dataIndex: 'payBusinessName', align: 'center',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Vendor`}]}
                    name={`payBusinessId_table_${record.receiveId}`} initialValue={record.payBusinessId}
                >
                    <SearchModal
                        qty={13}
                        title={'Vendor'}
                        value={record.payBusinessId}
                        text={record.payBusinessName}
                        id={`payBusinessId${record.receiveId}`}
                        query={{branchId: '1665596906844135426'}}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'payBusinessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit', dataIndex: 'unitName', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Unit'}]}
                    name={`unitId_table_${record.receiveId}`} initialValue={record.unitId}
                >
                    <SearchModal
                        qty={13}
                        title={'Unit'}
                        value={record.unitId}
                        text={record.unitName}
                        id={`unitId${record.id}`}
                        query={{dictCode: "unit_type"}}
                        url={"/apiBase/dict/queryDictDetailCommon"}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'unitId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'QTY', dataIndex: 'qty', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    // TODO: 一定要有 initialValue: 用于设置初始值
                    rules={[{required: true, message: `QTY`}]}
                    initialValue={record.qty} name={`qty_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.qtyStr}
                        id={`qty${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'qty', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Unit Price', dataIndex: 'orgUnitPrice', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Unit Price`}]}
                    initialValue={record.orgUnitPrice} name={`UnitPrice_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgUnitPriceStr}
                        id={`UnitPrice${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'orgUnitPrice', val)}
                    />
                </FormItem>,
        },
        {title: 'Amount', dataIndex: 'orgAmountStr', align: 'right', width: '7%',},
        {
            title: 'CURR', dataIndex: 'orgCurrencyName', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Currency`}]}
                    initialValue={record.orgCurrencyName} name={`orgCurrencyName_table_${record.receiveId}`}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record, 'orgCurrencyName', e)}
                    >
                        {CurrencyOpts?.map((key: string) => <Option key={key} value={key}>{key}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AR Bill CURR', dataIndex: 'receiveBillCurrencyName', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.receiveBillCurrencyName}
                    name={`receiveBillCurrencyName_table_${record.receiveId}`}
                    rules={[{required: true, message: `AR Bill CURR`}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record, 'receiveBillCurrencyName', e)}
                    >
                        {CurrencyOpts?.map((key: string) => <Option key={key} value={key}>{key}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AR Ex Rate', dataIndex: 'receiveOrgBillExrate', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Ap Ex Rate`}]}
                    initialValue={record.receiveOrgBillExrate} name={`receiveOrgBillExrate_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.receiveOrgBillExrateStr}
                        id={`payOrgBillExrate${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'receiveOrgBillExrate', val)}
                    />
                </FormItem>
        },
        {title: 'AR Bill Amount', dataIndex: 'receiveBillInTaxAmountStr', align: 'right', width: '7%',},
        {
            title: 'AP Bill CURR', dataIndex: 'payBillCurrencyName', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.payBillCurrencyName}
                    name={`payBillCurrencyName_table_${record.receiveId}`}
                    rules={[{required: true, message: `AR Bill CURR`}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record, 'payBillCurrencyName', e)}
                    >
                        {CurrencyOpts?.map((key: string) => <Option key={key} value={key}>{key}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AP Ex Rate', dataIndex: 'payOrgBillExrate', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `AP Ex Rate`}]}
                    initialValue={record.payOrgBillExrate} name={`payOrgBillExrate_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.payOrgBillExrateStr}
                        id={`payOrgBillExrate${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'payOrgBillExrate', val)}
                    />
                </FormItem>
        },
        {title: 'AP Bill Amount', dataIndex: 'payBillInTaxAmountStr', align: 'right', width: '7%',},
        {title: 'State', dataIndex: 'state', align: 'center', width: '8%', valueEnum: CHARGE_STATE_ENUM},
        {
            title: 'Action', align: 'center', width: '5%',
            render: (_: any, record: any, index: number) =>
                <>
                    <Popconfirm
                        onConfirm={() => handleDeleteCharge(record.id)}
                        title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                    >
                        <DeleteOutlined color={'red'}/>
                        <Divider type='vertical'/>
                    </Popconfirm>
                    <FormOutlined color={'#1765AE'} onClick={()=> handleEditRemark(index, record)} />
                </>
        },
    ];

    const rowSelection: any = {
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedKeys(selectedRowKeys);
            setSelectRows(selectedRows);
            handleChangeRows(selectedRowKeys, selectedRows);
        },
    };
    // endregion

    return (
        <ProCard title={'Reimbursement'} bordered={true} headerBordered className={'ant-card'}>
            <Row gutter={24}>
                <Col span={24}>
                    <Row gutter={24} style={{marginBottom: 12}}>
                        <Col span={8}>{renderTableTitle}</Col>
                        <Col span={16}>{renderAmountByCurrency(cgList)}</Col>
                    </Row>
                    <ProTable<APICGInfo>
                        rowKey={'receiveId'}
                        search={false}
                        options={false}
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={cgList}
                        rowSelection={rowSelection}
                        locale={{ emptyText: 'No Data' }}
                        className={'ant-pro-table-charge-info ant-pro-table-edit'}
                    />
                    <Remark
                        open={open} record={chargeRecord}
                        handleCancel={()=> setOpen(false)}
                        handleOk={(val: any)=> handleRowChange(chargeIndex, chargeRecord.id, 'remark', val)}
                    />
                    <ProFormText hidden={true} name={'reimbursementChargeList'} />
                </Col>
                <Col span={24}>
                    <Button icon={<PlusOutlined/>} onClick={handleAdd} className={'ant-btn-charge-add'}>Add Charge</Button>
                </Col>
            </Row>
        </ProCard>
    )
}
export default Agent;