import React, {useEffect, useState} from 'react';
import {Button, Col, message, Popconfirm, Row, Select, Space} from 'antd';
import {DeleteOutlined, PlusOutlined, FormOutlined, CopyOutlined} from '@ant-design/icons';
import {formatNumToMoney, ID_STRING, keepDecimal} from '@/utils/units';
import InputEditNumber from '@/components/InputEditNumber'
import {CHARGE_STATE_ENUM} from '@/utils/enum'
import SearchModal from '@/components/SearchModal';
import {ProCard, ProFormText, ProTable} from "@ant-design/pro-components";
import type {ProColumns} from '@ant-design/pro-table';
import {useModel} from '@@/plugin-model/useModel'
import ChargeRemark from '@/pages/sys-job/job/charge/charge-remark'
import {renderAmountByCurrency} from '@/pages/sys-job/job/charge/charge-table'
import {BRANCH_ID, CURRENCY_LIST, FUNC_CURRENCY_NAME} from "@/utils/auths";
import ls from 'lodash';

const Option = Select.Option;
// TODO: 数据类型
type APICGInfo = APIModel.PRCGInfo;

interface Props {
    CGType: number,
    jobId: string,
    CGList: APICGInfo[],
    isReload: boolean,
    form: any,
    FormItem: any,
    InvoTypeList: any[],
    // TODO: 保存
    handleChangeCopyState: () => void,
    handleChangeData: (data: any, CGType: number) => void,
    handleChangeRows: (selectRowKeys: any[], rows: any[], key: string) => void,
}

const Agent: React.FC<Props> = (props) => {
    const {
        CGType, jobId, CGList, isReload, form, FormItem, InvoTypeList,
        handleChangeCopyState
    } = props;

    const {
        queryCurrentExRateByTwoCurrencyAsync
    } = useModel('system.branch', (res: any) => ({
        queryCurrentExRateByTwoCurrencyAsync: res.queryCurrentExRateByTwoCurrencyAsync
    }));

    const {jobInfo} = useModel('job.job', (res: any) => ({jobInfo: res.jobInfo}));
    const {deleteCharges} = useModel('job.jobCharge', (res: any) => ({deleteCharges: res.deleteCharges}));

    const [cgList, setCGList] = useState<APICGInfo[]>(CGList || []);
    const [currRateList, setCurrRateList] = useState<any[]>([]);

    // TODO: 备注弹框
    const [open, setOpen] = useState<boolean>(false);
    // TODO: 选中的费用行
    const [chargeRecord, setChargeRecord] = useState<any>({});
    const [chargeIndex, setChargeIndex] = useState<number>(0);

    // TODO: 复选框
    const [selectRows, setSelectRows] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    useEffect(()=> {
        if (isReload) {
            setCGList(CGList);
            handleChangeCopyState();
            setSelectRows([]);
            setSelectedKeys([]);
            form?.setFieldsValue({reimbursementChargeList: CGList});
        }
    }, [CGList, form, handleChangeCopyState, isReload])

    const handleChangeData = (data: any) => {
        props.handleChangeData(data, CGType);
    }

    const handleChangeRows = (selectRowKeys: any[], rows: any[]) => {
        props.handleChangeRows(selectRowKeys, rows, 'agentArSelected');
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
            state: 1,
            orgCurrencyName: CurrencyNameOfBranch.currencyName,
            orgUnitPrice: '',
            orgUnitPriceStr: '',
            orgAmount: 0,
            orgAmountStr: '0',
            orgBillExrate: 0,
            orgBillExrateStr: '0',
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
            remark: '',

            // TODO: 代收对象
            receiveId: 'ar_' + ID_STRING(),
            receiveBusinessId: '',
            receiveBusinessName: '',
            receiveBusinessNameFullEn: '',
            receiveBusinessOracleId: '',
            receiveBillCurrencyName: '',
            receiveOrgBillExrate: 0,
            receiveOrgBillExrateStr: '',
            receiveBillUnitPrice: 0,
            receiveBillInTaxAmount: 0,
            receiveBillInTaxAmountStr: '0',

            // TODO: 代付对象
            payId: '',
            payBusinessId: '',
            payBusinessName: '',
            payBusinessNameFullEn: '',
            payBusinessOracleId: '',
            payBillCurrencyName: '',
            payOrgBillExrate: 1,
            payOrgBillExrateStr: '',
            payBillUnitPrice: 0,
            payBillInTaxAmount: 0,
            payBillInTaxAmountStr: '0',
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
            ...item, receiveId: ID_STRING() + index,
            state: 1, remark: '', id: '', payId: ''
        }));
        newData.push(...selectArr);
        setCGList(newData);
        form?.setFieldsValue({reimbursementChargeList: newData});
        handleChangeData(newData);
        message.success('Success');
        handleClearSelected();
    }

    function handleClearSelected() {
        // TODO: 清空选中的数据
        setSelectRows([]);
        setSelectedKeys([]);
        handleChangeRows([], []);
    }

    /**
     * @Description: TODO 查询公司原币到账单币汇率
     * @author LLS
     * @date 2023/10/18
     * @returns
     * @param index           费用序列行
     * @param currencyBill    账单币种
     * @param currencyOrig    原币币种
     */
    async function handleQueryCurrentExRateByTwoCurrencyAsync(index: number, currencyBill: any, currencyOrig: any){
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
     * @author LLS
     * @date 2023/10/18
     * @param index           费用序列行
     * @param currencyBill    账单币种
     * @param currencyOrig    原币币种
     * @param filedName       当前操作字段  receiveBillCurrencyName or payBillCurrencyName
     * @param record          费用行
     * @returns
     */
    const handleChangeCurrBill = async (index: number, currencyBill: any, currencyOrig: any, filedName: string, record: any) => {
        // TODO: 判断本地是否存在原币，账单币种的搭配汇率
        const currRateObj: any = currRateList.find((item: any) =>
            item.CurrencyOrig === currencyOrig && item.CurrencyABill === currencyBill
        ) || {};
        if (currRateObj.EXRateConvert) {
            // TODO: 有则拿前当前的
            const data = {ExRate: currRateObj.EXRateConvert, ExRateStr: formatNumToMoney(currRateObj.EXRateConvert)}
            await handleRowChange(index, record, filedName, currencyBill, data);
        } else {
            // TODO: 没有，则从后台获取
            const data: any = await handleQueryCurrentExRateByTwoCurrencyAsync(index, currencyBill, currencyOrig);
            await handleRowChange(index, record, filedName, currencyBill, data);
        }
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
    async function handleRowChange(index: number, record: any, filedName: string, val: any, data?: any) {
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
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], isRate ? 8 : 5));
            if (['qty', 'orgUnitPrice'].includes(filedName) && target.qty && target.orgUnitPrice) {
                target.orgAmount = keepDecimal(target.qty * target.orgUnitPrice) || 0;
                target.orgAmountStr = formatNumToMoney(target.orgAmount);
            }
        } else if (filedName === 'receiveBusinessId') {
            target.receiveBusinessName = data.nameFullEn;
            target.receiveBusinessNameFullEn = data.nameFullEn;
            target.receiveBusinessOracleId = data.oracleCustomerCode || '123456';
        } else if (filedName === 'payBusinessId') {
            target.payBusinessName = data.nameFullEn;
            target.payBusinessNameFullEn = data.nameFullEn;
            target.payBusinessOracleId = data.oracleSupplierCode || '123456';
        } else if (filedName === 'itemId') {
            target.itemName = data.label;
            target.itemSubjectCode = data.subjectCodeAd;
        } else if (filedName === 'unitId') {
            target.unitName = data.label;
        } else if (['orgCurrencyName', 'receiveBillCurrencyName', 'payBillCurrencyName'].includes(filedName)) {
            if (filedName === 'orgCurrencyName') {
                // TODO: 账单币种跟着原币走
                target.receiveBillCurrencyName = target.payBillCurrencyName = val;
                setFieldsVal[`receiveBillCurrencyName${nameStr}`] = setFieldsVal[`payBillCurrencyName${nameStr}`] = val;

                setFieldsVal[`receiveOrgBillExrate${nameStr}`] = setFieldsVal[`payOrgBillExrate${nameStr}`] = 1;
                target.receiveOrgBillExrate = target.payOrgBillExrate = 1;
                target.receiveOrgBillExrateStr = target.payOrgBillExrateStr = '1';
            } else if (filedName === 'receiveBillCurrencyName') {
                // TODO: 更新原币到账单币种的汇率
                setFieldsVal[`receiveOrgBillExrate${nameStr}`] = data?.ExRate;
                target.receiveOrgBillExrate = data?.ExRate;
                target.receiveOrgBillExrateStr = data?.ExRateStr;
            } else if (filedName === 'payBillCurrencyName') {
                // TODO: 更新原币到账单币种的汇率
                setFieldsVal[`payOrgBillExrate$${nameStr}`] = data?.ExRate;
                target.payOrgBillExrate = data?.ExRate;
                target.payOrgBillExrateStr = data?.ExRateStr;
            }
        } else if (filedName === 'remark') {
            setChargeRecord({});
            setChargeIndex(0);
            setOpen(false);
        }
        // TODO: 代收 账单币单价
        if (target.orgUnitPrice && target.receiveOrgBillExrate) {
            target.receiveBillUnitPrice = target.orgUnitPrice * target.receiveOrgBillExrate;
        }
        // TODO: 代付 账单币单价
        if (target.orgUnitPrice && target.payOrgBillExrate) {
            target.payBillUnitPrice = target.orgUnitPrice * target.payOrgBillExrate;
        }
        // TODO: 代收 账单币含税金额
        if (target.orgAmount && target.receiveOrgBillExrate) {
            target.receiveBillInTaxAmount = keepDecimal(target.orgAmount * target.receiveOrgBillExrate);
            target.receiveBillInTaxAmountStr = formatNumToMoney(target.receiveBillInTaxAmount);
        }
        // TODO: 代付 账单币含税金额
        if (target.orgAmount && target.payOrgBillExrate) {
            target.payBillInTaxAmount = keepDecimal(target.orgAmount * target.payOrgBillExrate);
            target.payBillInTaxAmountStr = formatNumToMoney(target.payBillInTaxAmount);
        }
        if (target.receiveBillInTaxAmount && target.orgCurrencyName && target.receiveBillCurrencyName) {
            // TODO: 判断账单币种选择时是否传回来了【账单币种到本位币】的汇率
            if (data?.EXRateABill && filedName === 'receiveBillCurrencyName') {
                target.funcAmountInTax = keepDecimal(target.receiveBillInTaxAmount * data?.EXRateABill);
            } else {
                // TODO: 判断本地是否存在原币，账单币种的搭配汇率
                const currRateObj: any = currRateList.find((item: any) =>
                    item.CurrencyOrig === target.orgCurrencyName && item.CurrencyABill === target.receiveBillCurrencyName
                ) || {};
                // TODO: 有则拿前当前的【账单币种到本位币】的汇率
                if (currRateObj?.EXRateABill) {
                    target.funcAmountInTax = keepDecimal(target.receiveBillInTaxAmount * currRateObj?.EXRateABill);
                } else {
                    // TODO: 没有，则从后台获取
                    const valueObj: any = await handleQueryCurrentExRateByTwoCurrencyAsync(index, target.receiveBillCurrencyName, target.orgCurrencyName);
                    target.funcAmountInTax = keepDecimal(target.receiveBillInTaxAmount * valueObj?.EXRateABill);
                }
            }
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
                chargeArr = chargeArr.filter((item: any) => !idList.includes(item.receiveId)) || [];
                setCGList(chargeArr);
                handleChangeData(chargeArr);
                form?.setFieldsValue({reimbursementChargeList: chargeArr});
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
    //endregion

    const columns: ProColumns<APICGInfo>[] = [
        {
            title: 'Description', dataIndex: 'itemName', width: '10%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.itemId}
                    name={`itemId_table_${record.receiveId}`}
                    rules={[{required: true, message: 'Description'}]}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        title='Description'
                        value={record.itemId}
                        text={record.itemName}
                        id={`itemId${record.receiveId}`}
                        query={{branchId: BRANCH_ID()}}
                        url={'/apiBase/chargeItem/queryChargeItemCommon'}
                        handleChangeData={(val: any, option: any) => handleRowChange(index, record, 'itemId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Payer', dataIndex: 'receiveBusinessName', align: 'center', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Payer'}]}
                    name={`receiveBusinessId_table_${record.receiveId}`} initialValue={record.receiveBusinessId}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        id={`receiveBusinessId${record.receiveId}`}
                        value={record.receiveBusinessId}
                        text={record.receiveBusinessName}
                        query={{branchId: BRANCH_ID()}}
                        title='Payer'
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'receiveBusinessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Vendor', dataIndex: 'payBusinessName', align: 'center', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Vendor'}]}
                    name={`payBusinessId_table_${record.receiveId}`} initialValue={record.payBusinessId}
                >
                    <SearchModal
                        qty={13}
                        isTextAlignCenter
                        id={`payBusinessId${record.receiveId}`}
                        value={record.payBusinessId}
                        text={record.payBusinessName}
                        query={{branchId: BRANCH_ID()}}
                        title='Vendor'
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'payBusinessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit', dataIndex: 'unitName', align: 'center', width: '5%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Unit'}]}
                    name={`unitId_table_${record.receiveId}`} initialValue={record.unitId}
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
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record, 'unitId', val, option)}
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
                    name={`qty_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text}
                        valueStr={record.qtyStr}
                        id={`qty${record.receiveId}`}
                        className={'isNumber-inp-center'}
                        handleChangeData={(val) => handleRowChange(index, record, 'qty', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Unit Price', dataIndex: 'orgUnitPrice', align: 'center', width: '7%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Unit Price'}]}
                    initialValue={record.orgUnitPrice} name={`orgUnitPrice_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgUnitPriceStr}
                        id={`orgUnitPrice${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'orgUnitPrice', val)}
                    />
                </FormItem>,
        },
        {title: 'Amount', dataIndex: 'orgAmountStr', align: 'right', width: '6%',},
        {
            title: 'CURR', dataIndex: 'orgCurrencyName', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Currency`}]}
                    initialValue={record.orgCurrencyName} name={`orgCurrencyName_table_${record.receiveId}`}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record, 'orgCurrencyName', e)}
                    >
                        {CURRENCY_LIST()?.map((key: any) => <Option key={key.currencyName} value={key.currencyName}>{key.currencyName}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AR Bill CURR', dataIndex: 'receiveBillCurrencyName', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.receiveBillCurrencyName}
                    name={`receiveBillCurrencyName_table_${record.receiveId}`}
                    rules={[{required: true, message: 'AR Bill CURR'}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleChangeCurrBill(index, e, record.orgCurrencyName,'receiveBillCurrencyName', record)}
                    >
                        {CURRENCY_LIST()?.map((key: any) => <Option key={key.currencyName} value={key.currencyName}>{key.currencyName}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AR Ex Rate', dataIndex: 'receiveOrgBillExrate', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'AR Ex Rate'}]}
                    initialValue={record.receiveOrgBillExrate} name={`receiveOrgBillExrate_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.receiveOrgBillExrateStr}
                        id={`receiveOrgBillExrate${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'receiveOrgBillExrate', val)}
                    />
                </FormItem>
        },
        {title: 'AR Bill Amount', dataIndex: 'receiveBillInTaxAmountStr', align: 'right', width: '6%',},
        {
            title: 'AP Bill CURR', dataIndex: 'payBillCurrencyName', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    initialValue={record.payBillCurrencyName}
                    name={`payBillCurrencyName_table_${record.receiveId}`}
                    rules={[{required: true, message: 'AP Bill CURR'}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleChangeCurrBill(index, e, record.orgCurrencyName,'payBillCurrencyName', record)}
                    >
                        {CURRENCY_LIST()?.map((key: any) => <Option key={key.currencyName} value={key.currencyName}>{key.currencyName}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'AP Ex Rate', dataIndex: 'payOrgBillExrate', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'AP Ex Rate'}]}
                    initialValue={record.payOrgBillExrate} name={`payOrgBillExrate_table_${record.receiveId}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.payOrgBillExrateStr}
                        id={`payOrgBillExrate${record.receiveId}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record, 'payOrgBillExrate', val)}
                    />
                </FormItem>
        },
        {title: 'AP Bill Amount', dataIndex: 'payBillInTaxAmountStr', align: 'right', width: '6%',},
        {title: 'State', dataIndex: 'state', align: 'center', width: '8%', valueEnum: CHARGE_STATE_ENUM},
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
    // endregion

    return (
        <ProCard title={'Reimbursement'} bordered={true} headerBordered className={'ant-card'}>
            <Row gutter={24}>
                <Col span={24}>
                    <Row gutter={24} style={{marginBottom: 10}}>
                        <Col span={8} className={'ant-table-title-info'}>
                            <div className={'ant-div-left'}>
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
                                            onClick={() => handleCopy()}>Copy</Button>
                                </Space>
                            </div>
                        </Col>
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
            </Row>
            <ProFormText hidden={true} name={'reimbursementChargeList'} />
        </ProCard>
    )
}
export default Agent;