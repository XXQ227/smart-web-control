import React, {useEffect, useState} from 'react';
import {Button, Col, Popconfirm, Row, Select, Form, Space, message} from 'antd';
import {DeleteOutlined, PlusOutlined, FormOutlined, CopyOutlined} from '@ant-design/icons';
import {useModel} from 'umi';
import {BRANCH_ID, CURRENCY_LIST, FUNC_CURRENCY_NAME} from '@/utils/auths';
import {formatNumToMoney, IconFont, ID_STRING, keepDecimal} from '@/utils/units';
import InputEditNumber from '@/components/InputEditNumber';
import {CHARGE_STATE_ENUM} from '@/utils/enum';
import ls from 'lodash';
import SearchModal from '@/components/SearchModal';
import {ProCard, ProFormText, ProTable} from "@ant-design/pro-components";
import type {ProColumns} from '@ant-design/pro-table';
import ChargeRemark from '@/pages/sys-job/job/charge/charge-remark';

const Option = Select.Option;
const FormItem = Form.Item;
// TODO: 数据类型
type APICGInfo = APIModel.PRCGInfo;

interface Props {
    CGType: number,             // TODO: 费用类型：1：ar; 2：ap
    CGList: APICGInfo[],        // TODO: 费用集合
    isRefund: boolean,          // TODO: 是否是 Refund
    jobId: any,                 // TODO: 单票 id
    isReload: boolean,      // TODO: 是否是 ar/ap 交互复制
    title: string,              // TODO: 抬头数据
    form: any,                  // TODO: form 表单
    formName: string,           // TODO: form name
    InvoTypeList: any[],        // TODO: 发票类型
    // TODO: 保存
    handleChangeData: (data: any, CGType: number, state: any) => void,  // TODO: 费用数据更新方法
    handleChangeCopyState: () => void,          // TODO: 复制方法
    // TODO: 处理所有选中的费用信息
    handleChangeRows: (selectRowKeys: any[], selectRows: any[], key: string) => void,
}

const ChargeTable: React.FC<Props> = (props) => {
    const {
        jobId, CGType, CGList, form, formName,
        InvoTypeList, title, isRefund,
        // TODO: 是否是 ar/ap 交互复制
        isReload, handleChangeCopyState
    } = props;

    const {
        queryCurrentExRateByTwoCurrencyAsync,
    } = useModel('system.branch', (res: any) => ({
        queryCurrentExRateByTwoCurrencyAsync: res.queryCurrentExRateByTwoCurrencyAsync,
    }));

    const {jobInfo} = useModel('job.job', (res: any) => ({jobInfo: res.jobInfo}));
    const {deleteCharges} = useModel('job.jobCharge', (res: any) => ({deleteCharges: res.deleteCharges}));

    const [cgList, setCGList] = useState<APICGInfo[]>(CGList || []);
    const [currRateList, setCurrRateList] = useState<any[]>([]);

    const [selectRows, setSelectRows] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    // TODO: 备注弹框
    const [open, setOpen] = useState<boolean>(false);
    // TODO: 选中的费用行
    const [chargeRecord, setChargeRecord] = useState<any>({});
    const [chargeIndex, setChargeIndex] = useState<number>(0);

    useEffect(()=> {
        if (isReload) {
            setCGList(CGList);
            setSelectRows([]);
            setSelectedKeys([]);
            handleChangeCopyState();
            form?.setFieldsValue({[formName]: CGList});
        }
    }, [CGList, form, formName, handleChangeCopyState, isReload])

    const handleChangeData = (data: any, state?: any) => {
        props.handleChangeData(data, CGType, state);
    }

    const handleChangeRows = (selectRowKeys: any[], rows: any[]) => {
        const key: string = CGType === 1 ? 'arSelected' : CGType === 2 ? 'apSelected' : CGType === 5 ? 'refundArSelected' : 'refundApSelected'
        props.handleChangeRows(selectRowKeys, rows, key);
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
        // 根据公司的本位币定义默认的原币种ID
        const CurrencyNameOfBranch = CURRENCY_LIST()?.find((x: any) => x.currencyName === FUNC_CURRENCY_NAME()) || {};
        const newDataObj: APICGInfo = {
            jobId,
            jobCode: jobInfo.code,
            branchId: BRANCH_ID(),
            jobBusinessLine: '1',
            businessId: '',
            businessName: '',
            businessNameFullEn: '',
            businessOracleId: '',
            id: ID_STRING(),
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
            orgCurrencyName: CurrencyNameOfBranch.currencyName,
            orgUnitPrice: '',
            orgUnitPriceStr: '',
            orgAmount: 0,
            orgAmountStr: '0',
            orgBillExrate: 1,
            orgBillExrateStr: '1',
            qty: '',
            qtyStr: '',
            billCurrencyName: CurrencyNameOfBranch.currencyName,
            billUnitPrice: 0,
            billInTaxAmount: 0,
            billInTaxAmountStr: '0',
            billNoTaxAmount: 0,
            billTaxAmount: 0,
            billWriteOffAmount: 0,
            billFuncExrate: 0,
            invoiceBillFuncExrate: 0,
            funcAmountInTax: 0,
            funcNoTaxAmount: 0,
            funcTaxAmount: 0,
            payMethod: 1,
            departmentCode: 1,
            salespersonCode: 1,
            operatorCode: 1,
            remark: '',
        };
        const newData: APICGInfo[] = [...cgList, newDataObj];
        setCGList(newData);
        handleChangeData(newData);
    }

    /**
     * @Description: TODO 查询公司原币到账单币汇率
     * @author LLS
     * @date 2023/10/16
     * @returns
     * @param index           费用序列行
     * @param currencyBill    账单币种
     * @param currencyOrig    原币币种
     */
    async function handleQueryCurrentExRateByTwoCurrencyAsync (index: number, currencyBill: any, currencyOrig: any){
        let data = {}
        try {
            const result: any = await queryCurrentExRateByTwoCurrencyAsync({currencyIDOrig: currencyOrig, currencyIDDest: currencyBill, branchId: BRANCH_ID()});
            // TODO: 获取【原币到账单币种、账单币种到本位币】的汇率。
            data = {
                ExRate: result?.data?.exRateConvert,
                ExRateStr: formatNumToMoney(keepDecimal(result?.data?.exRateConvert, 8)),
                EXRateABill: result?.data?.exRateBill
            };
            // TODO: 把从后台获取的【原币、账单币搭配汇率】存到本地，供下次使用<下次不再调用接口>
            const newCurrRateArr: any[] = ls.cloneDeep(currRateList);
            newCurrRateArr.push({
                CurrencyOrig: currencyOrig, CurrencyABill: currencyBill,
                EXRateABill: result?.data?.exRateBill, EXRateConvert: result?.data?.exRateConvert
            });
            setCurrRateList(newCurrRateArr);
        } catch (e) {
            message.error(e);
        }
        return data;
    }

    /**
     * @Description: TODO: 账单币种选择
     * @author XXQ
     * @date 2023/4/13
     * @param index           费用序列行
     * @param currencyBill    账单币种
     * @param currencyOrig    原币币种
     * @param rowID           费用行ID
     * @returns
     */
    const handleChangeCurrBill = async (index: number, currencyBill: any, currencyOrig: any, rowID: any) => {
        // TODO: 判断本地是否存在原币，账单币种的搭配汇率
        const currRateObj: any = currRateList.find((item: any) =>
            item.CurrencyOrig === currencyOrig && item.CurrencyABill === currencyBill
        ) || {};
        if (currRateObj.EXRateConvert) {
            // TODO: 有则拿前当前的
            const data = {ExRate: currRateObj.EXRateConvert, ExRateStr: formatNumToMoney(currRateObj.EXRateConvert)}
            await handleRowChange(index, rowID, 'billCurrencyName', currencyBill, data);
        } else {
            // TODO: 没有，则从后台获取
            const data: any = await handleQueryCurrentExRateByTwoCurrencyAsync(index, currencyBill, currencyOrig);
            await handleRowChange(index, rowID, 'billCurrencyName', currencyBill, data);
        }
    }

    /**
     * @Description: TODO：费用行编辑
     * @author XXQ
     * @date 2023/4/10
     * @param index     费用索引行
     * @param rowID     费用行ID
     * @param filedName 当前操作字段
     * @param val       当前行结果
     * @param data      选中的数据集
     * @returns
     */
    async function handleRowChange(index: number, rowID: any, filedName: string, val: any, data?: any) {
        const newData: APICGInfo[] = cgList?.map((item: APICGInfo) => ({...item})) || [];
        const target: any = newData.find((item: APICGInfo) => item.id === rowID) || {};

        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = ['qty', 'orgUnitPrice', 'orgBillExrate'].includes(filedName) ? Number(val) || null : val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}_table_${rowID}`]: target[filedName]};
        // TODO: 当录入【数量、单价】时，计算总价
        if (['qty', 'orgUnitPrice'].includes(filedName)) {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 5));
            target.orgAmount = keepDecimal(target.qty * target.orgUnitPrice) || 0;
            target.orgAmountStr = formatNumToMoney(target.orgAmount);
        } else if (filedName === 'itemId') {
            target.itemName = data.label;
            target.itemSubjectCode = [1, 5].includes(CGType) ? data.subjectCodeAr : data.subjectCodeAp;
        } else if (filedName === 'businessId') {
            target.businessName = data.nameFullEn;
            target.businessNameFullEn = data.nameFullEn;
            target.businessOracleId = data.oracleCustomerCode || '123456';
        } else if (filedName === 'unitId') {
            target.unitName = data.label;
        } else if (['orgCurrencyName', 'billCurrencyName'].includes(filedName)) {
            setFieldsVal[`orgBillExrate_table_${rowID}`] = data?.ExRate || 1;
            if (filedName === 'orgCurrencyName') {
                // TODO: 账单币种跟着原币走
                target.billCurrencyName = val;
                setFieldsVal[`billCurrencyName_table_${rowID}`] = val;
            }
            // TODO: 更新原币到账单币种的汇率
            target.orgBillExrate = data?.ExRate || 1;
            target.orgBillExrateStr = data?.ExRateStr || '1';
        } else if (filedName === 'orgBillExrate') {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 8));
        } else if (filedName === 'remark') {
            setChargeRecord({});
            setChargeIndex(0);
            setOpen(false);
        }
        if (target.orgUnitPrice && target.orgBillExrate) {
            target.billUnitPrice = target.orgUnitPrice * target.orgBillExrate;
        }
        if (target.orgAmount && target.orgBillExrate) {
            target.billInTaxAmount = keepDecimal(target.orgAmount * target.orgBillExrate);
            target.billInTaxAmountStr = formatNumToMoney(target.billInTaxAmount);
        }
        if (target.billInTaxAmount && target.orgCurrencyName && target.billCurrencyName) {
            // TODO: 判断账单币种选择时是否传回来了【账单币种到本位币】的汇率
            if (data?.EXRateABill) {
                target.funcAmountInTax = keepDecimal(target.billInTaxAmount * data?.EXRateABill);
            } else {
                // TODO: 判断本地是否存在原币，账单币种的搭配汇率
                const currRateObj: any = currRateList.find((item: any) =>
                    item.CurrencyOrig === target.orgCurrencyName && item.CurrencyABill === target.billCurrencyName
                ) || {};
                // TODO: 有则拿前当前的【账单币种到本位币】的汇率
                if (currRateObj?.EXRateABill) {
                    target.funcAmountInTax = keepDecimal(target.billInTaxAmount * currRateObj?.EXRateABill);
                } else {
                    // TODO: 没有，则从后台获取
                    const valueObj: any = await handleQueryCurrentExRateByTwoCurrencyAsync(index, target.billCurrencyName, target.orgCurrencyName);
                    target.funcAmountInTax = keepDecimal(target.billInTaxAmount * valueObj?.EXRateABill);
                }
            }
        }
        // target.isChange = true;
        newData.splice(index, 1, target);
        setFieldsVal[formName] = newData;
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
     * @Description: TODO: 复制费用
     * @author XXQ
     * @date 2023/4/10
     * @param state         复制成应收、应付
     * @returns
     */
    const handleCopy = (state: string) => {
        const newData: any[] = cgList.slice(0);
        let selectArr: any[] = selectRows.slice(0);
        selectArr = selectArr.map((item: any, index: number) => ({
            ...item, id: ID_STRING() + index,
            state: 1, remark: '',
        }));
        if (state === 'same') {
            newData.push(...selectArr);
            setCGList(newData);
            form?.setFieldsValue({[formName]: newData});
            handleChangeData(newData);
            message.success('Success');
        } else {
            selectArr = selectArr.map((item: any) => ({
                ...item, type: CGType === 1 ? 2 : CGType === 2 ? 1 : CGType === 5 ? 6 : 5,
            }));
            handleChangeData(selectArr, 'copy');
        }
        handleClearSelected();
    }

    function handleClearSelected() {
        // TODO: 清空选中的数据
        setSelectRows([]);
        setSelectedKeys([]);
        handleChangeRows([], []);
    }

    // TODO: 删除费用
    const handleRemove = async (idList: any[]) => {
        if (idList?.length > 0) {
            const rowKeys: React.Key[] = idList?.filter((key: string)=> key.indexOf('ID_') === -1) || [];

            let result: API.Result = {success: true};
            if (rowKeys) {
                result = await deleteCharges({jobId, idList: rowKeys});
            }
            if (result.success) {
                let chargeArr: any[] = cgList.slice(0);
                chargeArr = chargeArr.filter((item: any) => !idList.includes(item.id)) || [];
                setCGList(chargeArr);
                handleChangeData(chargeArr);
                form?.setFieldsValue({[formName]: chargeArr});
                handleClearSelected();
                message.success('Success');
            } else {
                message.error(result.message);
            }
        }
    }

    /**
     * @Description: TODO: 删除费用
     * @author XXQ
     * @date 2023/4/10
     * @param rowID     费用行
     * @returns
     */
    async function handleDeleteCharge(rowID?: any) {
        if (rowID) {
            await handleRemove([rowID]);
        } else {
            await handleRemove(selectedKeys);
        }
    }
    // endregion

    const cgColumns: ProColumns<APICGInfo>[] = [
        {
            title: 'Description', dataIndex: 'itemName', width: '13%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Description'}]}
                    initialValue={record.itemId} name={`itemId_table_${record.id}`}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        title={'Description'}
                        value={record.itemId}
                        text={record.itemName}
                        id={`itemId${record.id}`}
                        query={{branchId: BRANCH_ID()}}
                        url={'/apiBase/chargeItem/queryChargeItemCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'itemId', val, option)}
                    />
                </FormItem>
        },
        {
            title: [1, 5].includes(CGType) ? 'Payer' : 'Vendor', dataIndex: 'businessName', align: 'center', width: '15%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: [1, 5].includes(CGType) ? 'Payer' : 'Vendor'}]}
                    name={`businessId_table_${record.id}`} initialValue={record.businessId}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        id={`CTID${record.id}`}
                        value={record.businessId}
                        text={record.businessName}
                        query={{branchId: BRANCH_ID()}}
                        title={[1, 5].includes(CGType) ? 'Payer' : 'Vendor'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'businessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit', dataIndex: 'unitName', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Unit'}]}
                    name={`unitId_table_${record.id}`} initialValue={record.unitId}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        title={'Unit'}
                        value={record.unitId}
                        text={record.unitName}
                        id={`unitId${record.id}`}
                        query={{dictCode: "unit_type"}}
                        url={"/apiBase/dict/queryDictDetailCommon"}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'unitId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'QTY', dataIndex: 'qty', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    // TODO: 一定要有 initialValue: 用于设置初始值
                    rules={[
                        {required: true, message: `QTY`},
                        {pattern: /^-?([1-9]\d*|0)(\.\d{0,5})?$/, message: 'Must be 0.00000 in numeric format'}
                    ]}
                    initialValue={record.qty}
                    name={`qty_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text}
                        valueStr={record.qtyStr}
                        id={`qty${record.id}`}
                        className={'isNumber-inp-center'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'qty', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Unit Price', dataIndex: 'orgUnitPrice', align: 'center', width: '9%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[
                        {required: true, message: 'Unit Price'},
                        {pattern: isRefund ? /^-((\d+(\.\d{0,5})?)|(\d*\.\d{1,5}))$/ : /^/, message: 'Must be a negative number'},
                    ]}
                    initialValue={record.orgUnitPrice} name={`orgUnitPrice_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgUnitPriceStr}
                        id={`orgUnitPrice${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'orgUnitPrice', val)}
                    />
                </FormItem>,
        },
        {title: 'Amount', dataIndex: 'orgAmountStr', align: 'right', width: '9%',},
        {
            title: 'CURR', dataIndex: 'orgCurrencyName', align: 'center', width: '7%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Currency`}]}
                    initialValue={record.orgCurrencyName} name={`orgCurrencyName_table_${record.id}`}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record.id, 'orgCurrencyName', e)}
                    >
                        {CURRENCY_LIST()?.map((key: any) => <Option key={key.currencyName} value={key.currencyName}>{key.currencyName}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Bill CURR', dataIndex: 'billCurrencyName', align: 'center', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Bill CUR'}]}
                    initialValue={record.billCurrencyName} name={`billCurrencyName_table_${record.id}`}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleChangeCurrBill(index, e, record.orgCurrencyName, record.id)}
                    >
                        {CURRENCY_LIST()?.map((key: any) => <Option key={key.currencyName} value={key.currencyName}>{key.currencyName}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Ex Rate', dataIndex: 'orgBillExrate', align: 'center', width: '7%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Ex Rate'}]}
                    initialValue={record.orgBillExrate} name={`orgBillExrate_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgBillExrateStr}
                        id={`orgBillExrate${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'orgBillExrate', val)}
                    />
                </FormItem>,
        },
        {title: 'Bill Amount', dataIndex: 'billInTaxAmountStr', align: 'right', width: '10%'},
        {title: 'State', dataIndex: 'state', align: 'center', width: '9%', valueEnum: CHARGE_STATE_ENUM},
        {
            title: 'Action', align: 'center', width: 50,
            render: (_: any, record: any, index: number) =>
                <>
                    {/*<Popconfirm
                        onConfirm={() => handleDeleteCharge(record.id)}
                        title="Sure to delete?" okText={'Yes'} cancelText={'No'}
                    >
                        <DeleteOutlined color={'red'}/>
                        <Divider type='vertical'/>
                    </Popconfirm>*/}
                    <FormOutlined color={'#1765AE'} onClick={() => handleEditRemark(index, record)} />
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

    return (
        <ProCard title={title} bordered={true} headerBordered className={'ant-card'}>
            <Row gutter={24} className={'ant-margin-bottom-24'}>
                <Col span={24}>
                    <Row gutter={24} style={{marginBottom: 10}}>
                        <Col span={8} className={'ant-table-title-info'}>
                            <div className={'ant-div-left'}>
                                {/*<span className={'ant-table-title-label'}>AR</span>*/}
                                <Space className='ant-btn-charge'>
                                    <Popconfirm
                                        onConfirm={() => handleDeleteCharge()}
                                        title="Sure to delete?"
                                        okText={'Yes'} cancelText={'No'}
                                        disabled={selectedKeys?.length === 0}
                                    >
                                        <Button icon={<DeleteOutlined/>} disabled={selectedKeys?.length === 0}>Remove</Button>
                                    </Popconfirm>
                                    <Button icon={<CopyOutlined />} disabled={selectedKeys?.length === 0}
                                            onClick={() => handleCopy('same')}>Copy</Button>
                                    <Button icon={<IconFont type={'icon-Copy-To'}/>}
                                            disabled={selectedKeys?.length === 0}
                                            onClick={() => handleCopy('noSame')}
                                    >Copy to {[1, 5].includes(CGType) ? 'AP' : 'AR'}</Button>
                                </Space>
                            </div>
                        </Col>
                        <Col span={16}>{renderAmountByCurrency(cgList)}</Col>
                    </Row>
                    <ProTable<APICGInfo>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        pagination={false}
                        columns={cgColumns}
                        dataSource={cgList}
                        tableAlertRender={false}
                        rowSelection={rowSelection}
                        locale={{ emptyText: 'No Data' }}
                        className={'ant-pro-table-charge-info ant-pro-table-edit'}
                    />
                    <ChargeRemark
                        open={open} record={chargeRecord}
                        handleCancel={()=> setOpen(false)}
                        handleOk={(val: any)=> handleRowChange(chargeIndex, chargeRecord.id, 'remark', val)}
                    />
                </Col>
                <Col span={24}>
                    <Button icon={<PlusOutlined/>} onClick={handleAdd} className={'ant-btn-charge-add'}>Add Charge</Button>
                </Col>
                <ProFormText hidden={true} name={formName} />
            </Row>
        </ProCard>
    )
}
export default ChargeTable;

/**
 * @Description: TODO: 计算各币种的费用
 * @author XXQ
 * @date 2023/8/22
 * @param cgList    费用集合
 * @returns
 */
export function renderAmountByCurrency(cgList: any[]) {
    const obj: Record<string, { total: number }> = {};
    let localAmount = 0;
    if (cgList?.length > 0) {
        cgList.map((item: any) => {
            if (!item) return true;
            if (!!item.orgCurrencyName) {
                if (!obj[item.orgCurrencyName]) {
                    obj[item.orgCurrencyName] = {
                        total: item.orgAmount,
                    };
                } else {
                    obj[item.orgCurrencyName].total += item.orgAmount;
                }
            }
            if (item.funcAmountInTax) {
                localAmount += item.funcAmountInTax;
            } else if (item.orgCurrencyName === 'HKD') {
                localAmount += item.orgAmount;
            } else if (item.billCurrencyName === 'HKD') {
                localAmount += item.billInTaxAmount;
            } else {
                localAmount += item.orgAmount * item.orgBillExrate;
            }
            return true;
        });
    }
    if (Object.keys(obj).length > 0) {
        return (
            <div className={'ant-charge-total-amount-info'}>
                {
                    Object.keys(obj).map((item, index) => {
                        return (
                            <div key={`${index + 1}`} className="result-text" >
                                <span>{item}：</span>
                                <b>{formatNumToMoney(keepDecimal(obj[item].total).toFixed(2))}</b>
                            </div>
                        )
                    })
                }
                <div>
                    Total (in HKD)：<b>{formatNumToMoney(keepDecimal(localAmount).toFixed(2))}</b>
                </div>
            </div>
        )
    } else {
        return null;
    }
}