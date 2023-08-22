import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Popconfirm, Row, Select, Form, Space, message} from 'antd';
import {DeleteOutlined, PlusOutlined, FormOutlined} from '@ant-design/icons';
import {useModel} from 'umi';
import {getBranchID, getUserID} from '@/utils/auths';
import {formatNumToMoney, ID_STRING, keepDecimal} from '@/utils/units';
import InputEditNumber from '@/components/InputEditNumber'
import {CHARGE_STATE_ENUM} from '@/utils/enum'
import {stringify} from 'querystring';
import ls from 'lodash';
import SearchModal from '@/components/SearchModal';
import {ProCard, ProFormText, ProTable} from "@ant-design/pro-components";
import type {ProColumns} from '@ant-design/pro-table';
import {Remark} from '@/pages/sys-job/job/charge/remark'

const Option = Select.Option;
const FormItem = Form.Item;
// TODO: 数据类型
type APICGInfo = APIModel.PRCGInfo;

interface Props {
    CGType: number,             // TODO: 费用类型：1：ar; 2：ap
    CGList: APICGInfo[],        // TODO: 费用集合
    jobId: any,                 // TODO: 单票 id
    isCopyNoSame: boolean,      // TODO: 是否是 ar/ap 交互复制
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
        InvoTypeList, title,
        // TODO: 是否是 ar/ap 交互复制
        isCopyNoSame, handleChangeCopyState
    } = props;
    const CurrencyOpts = ['CNY', 'HKD', 'USD'];
    const {jobInfo} = useModel('job.job', (res: any) => ({jobInfo: res.jobInfo}));
    const {deleteCharges} = useModel('job.jobCharge', (res: any) => ({deleteCharges: res.deleteCharges}));

    const [cgList, setCGList] = useState<APICGInfo[]>(CGList || []);
    const [currRateList, setCurrRateList] = useState<any[]>([]);

    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    // TODO: 备注弹框
    const [open, setOpen] = useState<boolean>(false);
    // TODO: 选中的费用行
    const [chargeRecord, setChargeRecord] = useState<any>({});
    const [chargeIndex, setChargeIndex] = useState<number>(0);

    useEffect(()=> {
        if (isCopyNoSame) {
            setCGList(CGList);
            handleChangeCopyState();
        }
    }, [CGList, handleChangeCopyState, isCopyNoSame])

    const handleChangeData = (data: any, state?: any) => {
        props.handleChangeData(data, CGType, state);
    }

    const handleChangeRows = (selectRowKeys: any[], rows: any[]) => {
        props.handleChangeRows(selectRowKeys, rows, CGType === 1 ? 'arSelected' : 'apSelected');
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
        };
        const newData: APICGInfo[] = [...cgList, newDataObj];
        setCGList(newData);
        handleChangeData(newData);
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
        const newData: APICGInfo[] = cgList?.map((item: APICGInfo) => ({...item})) || [];
        const target: any = newData.find((item: APICGInfo) => item.id === rowID) || {};

        const fileLen: number = filedName.length;
        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = ['qty', 'orgUnitPrice', 'orgBillExrate'].includes(filedName) ? Number(val) || null : val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}_table_${rowID}`]: target[filedName]};
        // TODO: 当录入【数量、单价】时，计算总价
        if (['qty', 'orgUnitPrice'].includes(filedName)) {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 5));
            if (target.qty && target.orgUnitPrice) {
                target.orgAmount = keepDecimal(target.qty * target.orgUnitPrice);
                target.orgAmountStr = formatNumToMoney(target.orgAmount);
            }
        } else if (filedName === 'businessId') {
            target.businessName = data.nameFullEn;
            target.businessOracleId = data.oracleCustomerCode || '123456';
        } else if (filedName === 'itemId') {
            target.itemName = data.label;
            target.itemSubjectCode = CGType === 1 ? data.subjectCodeAr : data.subjectCodeAp;
        } else if (filedName === 'unitId') {
            target.unitName = data.label;
        } else if (filedName === 'orgBillExrate') {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 7));
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
        } else if (filedName.substring(fileLen-2, fileLen) === 'ID') {
            // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
            target[filedName.substring(0, fileLen-2) + 'Name'] = data?.label;
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
        // target.isChange = true;
        newData.splice(index, 1, target);
        setFieldsVal[formName] = newData;
        form?.setFieldsValue(setFieldsVal);
        setCGList(newData);
        handleChangeData(newData);
    }

    /**
     * @Description: TODO: 账单币种选择
     * @author XXQ
     * @date 2023/4/13
     * @param index     费用序列行
     * @param val       选中的账单币种
     * @param record    费用行
     * @returns
     */
    function handleChangeABillCurr(index: number, val: any, record: APICGInfo) {
        if (val !== record.orgCurrencyName) {
            // TODO: 判断本地是否存在原币，账单币种的搭配汇率
            const currRateObj: any = currRateList.find((item: any) =>
                item.CurrencyOrig === record.orgCurrencyName && item.CurrencyABill === val
            ) || {};
            if (currRateObj.EXRateConvert) {
                // TODO: 有则拿前当前的；
                const data = {ExRate: currRateObj.EXRateConvert, ExRateStr: formatNumToMoney(currRateObj.EXRateConvert)}
                handleRowChange(index, record.id, 'billCurrencyName', val, data);
            } else {
                // TODO: 没有，则从后台获取
                // 当账单我听币种跟原币不一样时，从后台获取汇率
                const valueObj = {CurrencyOrig: record.orgCurrencyName, CurrencyABill: val, UserID: getUserID()};
                const options: any = {headers: {BranchID: getBranchID()}}
                fetch(`/api/ABill/GetABillEXRate?${stringify(valueObj)}`, options)
                    .then(response => response.json())
                    .then((result: any) => {
                        // TODO: 获取【原币到账单币种、账单币种到本位币】的汇率。
                        const data = {ExRate: result.EXRateConvert, ExRateStr: formatNumToMoney(result.EXRateConvert)};
                        // TODO: 把从后台获取的【原币、账单币搭配汇率】存到本地，供下次使用<下次不再调用接口>
                        const newCurrRateArr: any[] = ls.cloneDeep(currRateList);
                        newCurrRateArr.push({
                            CurrencyOrig: record.orgCurrencyName, CurrencyABill: val,
                            EXRateABill: result.EXRateABill, EXRateConvert: result.EXRateConvert
                        });
                        setCurrRateList(newCurrRateArr);
                        handleRowChange(index, record.id, 'billCurrencyName', val, data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        } else {
            handleRowChange(index, record.id, 'billCurrencyName', val, {ExRate: 1, ExRateStr: 1});
        }
    }

    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @param rowID     费用行
     * @returns
     */
    function handleDeleteCharge(rowID: any) {
        const newCGData: APICGInfo[] = cgList.filter((item: APICGInfo) => item.id !== rowID) || [];
        setCGList(newCGData);
        handleChangeData(newCGData);
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
            message.success('success');
        } else {
            selectArr = selectArr.map((item: any) => ({
                ...item, type: CGType === 1 ? 2 : 1,
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
    // endregion

    const renderTableTitle = (
        <div className={'ant-table-title-info'}>
            <div className={'ant-div-left'}>
                {/*<span className={'ant-table-title-label'}>AR</span>*/}
                <Space>
                    <Button disabled={selectedKeys?.length === 0} onClick={() => handleRemove()}>Remove</Button>
                    <Button disabled={selectedKeys?.length === 0} onClick={() => handleCopy('same')}>Copy</Button>
                    <Button disabled={selectedKeys?.length === 0} onClick={() => handleCopy('noSame')}>
                        Copy to {CGType === 1 ? 'AP' : 'AR'}
                    </Button>
                </Space>
            </div>
            {/*<div className={'ant-div-right'}>
                <Space>
                    <Button hidden={APHidden} onClick={() => handleCopy('same')}>Credit Note</Button>
                    <Button hidden={APHidden} onClick={() => handleCopy('noSame')}>Debit Note</Button>
                </Space>
            </div>*/}
        </div>
    );

    // const renderTableFooter = (
    //     <div className={'ant-table-footer-info'}>
    //         <div className={'ant-div-left'}>
    //             <Space>
    //                 <span className={'ant-table-title-label'}>Total：</span>
    //                 <label>{}</label>
    //             </Space>
    //         </div>
    //         <div className={'ant-div-right'}>
    //             <Space>
    //                 <span className={'ant-table-title-label'}>Total HKD：</span>
    //                 <label>{}</label>
    //             </Space>
    //         </div>
    //     </div>
    // );

    // endregion

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
                        title={'Description'}
                        value={record.itemId}
                        text={record.itemName}
                        id={`CGItemID${record.id}`}
                        query={{branchId: '1665596906844135426'}}
                        url={'/apiBase/chargeItem/queryChargeItemCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'itemId', val, option)}
                    />
                </FormItem>
        },
        {
            title: CGType === 1 ? 'Payer' : 'Vendor', dataIndex: 'businessName', align: 'center',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: CGType === 1 ? 'Payer' : 'Vendor'}]}
                    name={`businessId_table_${record.id}`} initialValue={record.businessId}
                >
                    <SearchModal
                        qty={13}
                        id={`CTID${record.id}`}
                        value={record.businessId}
                        text={record.businessName}
                        query={{branchId: '1665596906844135426'}}
                        title={CGType === 1 ? 'Payer' : 'Vendor'}
                        filedValue={'id'} filedLabel={'nameFullEn'}
                        url={'/apiBase/businessUnitProperty/queryBusinessUnitPropertyCommon'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.id, 'businessId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Unit', dataIndex: 'unitName', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: 'Unit!'}]}
                    name={`unitId_table_${record.id}`} initialValue={record.unitId}
                >
                    <SearchModal
                        qty={13}
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
            title: 'QTY', dataIndex: 'qty', align: 'center', width: '6%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    // TODO: 一定要有 initialValue: 用于设置初始值
                    rules={[{required: true, message: `qty`}]}
                    initialValue={record.qty} name={`qty_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.qtyStr}
                        id={`qty${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'qty', val)}
                    />
                </FormItem>,
        },
        {
            title: 'Unit Price', dataIndex: 'orgUnitPrice', align: 'center', width: '10%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Unit Price`}]}
                    initialValue={record.orgUnitPrice} name={`orgUnitPrice_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgUnitPriceStr}
                        id={`orgUnitPrice${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'orgUnitPrice', val)}
                    />
                </FormItem>,
        },
        {title: 'Amount', dataIndex: 'orgAmountStr', align: 'right', width: '10%',},
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
                        {CurrencyOpts?.map((key: string) => <Option key={key} value={key}>{key}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Bill CURR', dataIndex: 'billCurrencyName', align: 'center', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Bill CUR`}]}
                    initialValue={record.billCurrencyName} name={`billCurrencyName_table_${record.id}`}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleChangeABillCurr(index, e, record)}
                    >
                        {CurrencyOpts?.map((key: string) => <Option key={key} value={key}>{key}</Option>)}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Ex Rate', dataIndex: 'orgBillExrate', align: 'center', width: '8%',
            render: (text: any, record: APICGInfo, index) =>
                <FormItem
                    rules={[{required: true, message: `Ex Rate`}]}
                    initialValue={record.orgBillExrate} name={`orgBillExrate_table_${record.id}`}
                >
                    <InputEditNumber
                        value={text} valueStr={record.orgBillExrateStr}
                        id={`orgBillExrate${record.id}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.id, 'orgBillExrate', val)}
                    />
                </FormItem>
        },
        {title: 'State', dataIndex: 'state', align: 'center', width: '8%', valueEnum: CHARGE_STATE_ENUM,},
        {
            title: 'Action', align: 'center', width: 60,
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

    return (
        <ProCard title={title} bordered={true} headerBordered className={'ant-card'}>
            <Row gutter={24} className={'ant-margin-bottom-24'}>
                <Col span={24}>
                    <Row gutter={24} style={{marginBottom: 12}}>
                        <Col span={8}>{renderTableTitle}</Col>
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
                    <Remark
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
    // console.log(newData)
    const obj: Record<string, { total: number }> = {};
    if (cgList?.length > 0) {
        cgList.map((item: any) => {
            if (!item) return true;
            if (item.orgUnitPrice && item.qty) {
                if (!!item.orgCurrencyName) {
                    if (!obj[item.orgCurrencyName]) {
                        obj[item.orgCurrencyName] = {
                            total: item.orgUnitPrice * item.qty,
                        };
                    } else {
                        obj[item.orgCurrencyName].total += item.orgUnitPrice * item.qty;
                    }
                }
            }
            return true;
        });
    }
    if (Object.keys(obj).length > 0) {
        return (
            Object.keys(obj).map((item, index) => {
                return (
                    <div key={`${index + 1}`} className="result-text" style={{float: "right"}}>
                        <span style={{fontWeight: 500}}>{item}：</span>
                        <b>{formatNumToMoney(keepDecimal(obj[item].total).toFixed(2))}</b>
                    </div>
                )
            })
        )
    } else {
        return null;
    }
}