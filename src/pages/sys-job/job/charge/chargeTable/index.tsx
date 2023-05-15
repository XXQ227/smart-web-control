import React, {useEffect, useState} from 'react';
import {Button, Col, Popconfirm, Row, Select, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {PlusOutlined} from '@ant-design/icons';
import {useModel} from 'umi';
import {getBranchID, getFuncCurrency, getUserID} from '@/utils/auths';
import {formatNumToMoney, keepDecimal} from '@/utils/units';
import InputEdit from '@/pages/sys-job/job/charge/components/InputNumberEdit'
import {ChargeStateEnum} from '@/utils/enum'
import {stringify} from 'querystring';
import ls from 'lodash';
import SearchModal from '@/components/SearchModal';

const Option = Select.Option;
// TODO: 数据类型
type APICGInfo = APIModel.PRCGInfo;
type APICurrency = APIModel.CurrencyOpts;

interface Props {
    CGType: number,
    CGList: APICGInfo[],
    form: any,
    formRef: any,
    formCurrent: any,
    FormItem: any,
    // TODO: 保存
    handleChangeData: (data: any, CGType: number) => void,
}


// TODO: 获取原币到账单币种、账单币种到本位币的汇率数据
type ABillRateResult = {
    CurrencyOrig?: number,
    CurrencyABill?: number,
    EXRateABill?: number,
    EXRateConvert?: number,
}

const ChargeTable: React.FC<Props> = (props) => {
    // @ts-ignore
    const {CGType, CGList, form, FormItem} = props;
    const {
        ChargeBaseInfo: {CurrencyOpts}
    } = useModel('job.jobCharge', (res: any) => ({ChargeBaseInfo: res.ChargeBaseInfo}));


    const [cgList, setCGList] = useState<APICGInfo[]>(CGList || []);
    const [currRateList, setCurrRateList] = useState<ABillRateResult[]>([]);

    const cgColumns: ColumnsType<APICGInfo> = [
        {
            title: 'Charge Name',
            dataIndex: 'CGItemName',
            align: 'center',
            width: 140,
            render: (text: any, record, index) =>
                <FormItem
                    initialValue={record.CGItemID}
                    name={`CGItemID${record.CGID}`}
                    rules={[{required: true, message: '请输入费用名称!'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        title={'Charge Name'}
                        value={record.CGItemID}
                        id={`CGItemID${record.CGID}`}
                        url={'/api/MCommon/GetProCGItemByProID'}
                        query={{UserID: getUserID(), CTType: 1, SystemID: 4,}}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.CGID, 'CGItemID', val, option)}
                    />
                </FormItem>
        },
        {
            title: CGType === 1 ? 'Customer' : 'Payer',
            dataIndex: 'CTName',
            align: 'center',
            render: (text: any, record, index) =>
                <FormItem
                    name={`CTID${record.CGID}`}
                    initialValue={record.CGItemID}
                    rules={[{required: true, message: `请输入${CGType === 1 ? 'Customer' : 'Payer'}`}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        value={record.CTID}
                        id={`CTID${record.CGID}`}
                        url={'/api/MCommon/GetCTNameByStrOrType'}
                        title={CGType === 1 ? 'Customer' : 'Payer'}
                        query={{
                            searchPayer: true, BusinessLineID: null,
                            UserID: getUserID(), CTType: 1, SystemID: 4,
                        }}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.CGID, 'CTID', val, option)}
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
                    name={`CGUnitID${record.CGID}`}
                    initialValue={record.CGUnitID}
                    rules={[{required: true, message: '请输入费用单位!'}]}
                >
                    <SearchModal
                        qty={13}
                        text={text}
                        title={'Unit'}
                        value={record.CGUnitID}
                        id={`CGUnitID${record.CGID}`}
                        query={{BranchID: getBranchID()}}
                        url={'/api/MCommon/GetCGUnitByStr'}
                        handleChangeData={(val: any, option: any)=> handleRowChange(index, record.CGID, 'CGUnitID', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'Currency',
            dataIndex: 'CurrencyName',
            align: 'center',
            width: 80,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.CurrencyID}
                    name={`CurrencyID${record.CGID}`}
                    rules={[{required: true, message: `Currency is required.`}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleRowChange(index, record.CGID, 'CurrencyID', e)}
                    >
                        {CurrencyOpts?.map((item: APICurrency) =>
                            <Option key={item.CurrencyID} value={item.CurrencyID}>{item.Currency}</Option>
                        )}
                    </Select>
                </FormItem>,
        },
        {
            title: 'QTY',
            dataIndex: 'QTY',
            align: 'center',
            width: 100,
            render: (text: any, record: any, index) =>
                <FormItem
                    // TODO: 一定要有 initialValue: 用于设置初始值
                    initialValue={record.QTY} name={`QTY${record.CGID}`}
                    rules={[{required: true, message: `QTY is required.`}]}
                >
                    <InputEdit
                        value={text} valueStr={record.QTYStr}
                        id={`QTY${record.CGID}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.CGID, 'QTY', val)}
                    />
                </FormItem>,
        },
        {
            title: 'U. Price',
            dataIndex: 'UnitPrice',
            align: 'center',
            width: 100,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={text} name={`UnitPrice${record.CGID}`}
                    rules={[{required: true, message: `Unit Price is required.`}]}
                >
                    <InputEdit
                        value={text} valueStr={record.UnitPriceStr}
                        id={`UnitPrice${record.CGID}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.CGID, 'UnitPrice', val)}
                    />
                </FormItem>,
        },
        {title: 'Amount', dataIndex: 'AmountStr', align: 'center', width: 110,},
        {
            title: 'Bill CUR',
            dataIndex: 'ABillCurrencyTempName',
            align: 'center',
            width: 72,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={record.ABillCurrencyTempID}
                    name={`ABillCurrencyTempID${record.CGID}`}
                    rules={[{required: true, message: `Bill CUR is required.`}]}
                >
                    <Select
                        dropdownMatchSelectWidth={false}
                        onSelect={(e) => handleChangeABillCurr(index, e, record)}
                    >
                        {CurrencyOpts?.map((item: APICurrency) =>
                            <Option key={item.CurrencyID} value={item.CurrencyID}>{item.Currency}</Option>
                        )}
                    </Select>
                </FormItem>,
        },
        {
            title: 'Ex-Rate',
            dataIndex: 'ExRate',
            align: 'center',
            width: 80,
            render: (text: any, record: any, index) =>
                <FormItem
                    initialValue={text} name={`ExRate${record.CGID}`}
                    rules={[{required: true, message: `Ex-Rate is required.`}]}
                >
                    <InputEdit
                        value={text} valueStr={record.ExRateStr}
                        id={`ExRate${record.CGID}`} className={'isNumber-inp'}
                        handleChangeData={(val) => handleRowChange(index, record.CGID, 'ExRate', val)}
                    />
                </FormItem>
        },
        {
            title: 'State', dataIndex: 'State', align: 'center', width: 140,
            render: (value: any) => <div>{ChargeStateEnum[value]?.status}</div>
        },
        {
            title: 'Operate',
            align: 'center',
            width: 100,
            render: (_, record: any) =>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteCharge(record.CGID)}>
                    <a>Delete</a>
                </Popconfirm>,
        },
    ];

    useEffect(() => {

    })

    const handleChangeData = (data: any) => {
        props.handleChangeData(data, CGType);
    }

    //region function 方法
    /**
     * @Description: TODO: 添加费用
     * @author XXQ
     * @date 2023/4/10
     * @returns
     */
    const handleAdd = () => {
        const currLocalObj: APICurrency = CurrencyOpts?.find((x: APICurrency) => x.Currency === getFuncCurrency()) || {};
        const CGID = Date.now().toString();
        const newDataObj: APICGInfo = {
            CGID,
            CTID: null,
            CTName: '',
            CGItemID: null,
            // CGItemName: '',
            QTY: null,
            UnitPrice: null,
            Amount: null,
            AmountABill: 0,
            AmountFunc: 0,
            AmountFuncNoTax: 0,
            InvoNum: '',
            IsOperatorConfirm: false,
            IsManagerConfirm: false,
            IsSecondConfirm: false,
            // TODO: 原币
            CurrencyID: currLocalObj?.CurrencyID,
            // CurrencyName: currLocalObj?.Currency,
            // TODO: 账单币种
            ABillCurrencyTempID: currLocalObj?.CurrencyID,
            // ABillCurrencyTempName: currLocalObj?.Currency,
            ExRate: 1,
            ExRateStr: '1',

            CreatorID: getUserID(),
            InvoTypeID: 0,
            State: '1',
            CGType,
        };
        const newData: APICGInfo[] = [...cgList, newDataObj];
        setCGList(newData);
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
        const target: any = newData.find((item: APICGInfo) => item.CGID === rowID) || {};

        const fileLen: number = filedName.length;
        // TODO: 当录入【数量、单价、汇率】时，转成数字型
        target[filedName] = ['QTY', 'UnitPrice', 'ExRate'].includes(filedName) ? Number(val) || null : val?.target ? val?.target?.value || null : val;
        // TODO: 用于设置 form 里的值，否则必填字段验证时不会被响应
        const setFieldsVal = {[`${filedName}${rowID}`]: target[filedName]};
        // TODO: 当录入【数量、单价】时，计算总价
        if (['QTY', 'UnitPrice'].includes(filedName)) {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 5));
            if (target.QTY && target.UnitPrice) {
                target.Amount = keepDecimal(target[filedName] * target[filedName === 'QTY' ? 'UnitPrice' : 'QTY']);
                target.AmountStr = formatNumToMoney(target.Amount);
            }
        } else if (filedName === 'ExRate') {
            // TODO: 千分符转换
            target[`${filedName}Str`] = formatNumToMoney(keepDecimal(target[filedName], 7));
        } else if (['CurrencyID', 'ABillCurrencyTempID'].includes(filedName)) {
            setFieldsVal[`ExRate${rowID}`] = data?.ExRate || 1;
            if (filedName === 'CurrencyID') {
                // TODO: 账单币种跟着原币走
                target.ABillCurrencyTempID = val;
                setFieldsVal[`ABillCurrencyTempID${rowID}`] = val;
            }
            // TODO: 更新原币到账单币种的汇率
            target.ExRate = data?.ExRate || 1;
            target.ExRateStr = data?.ExRateStr || '1';
        } else if (filedName.substring(fileLen-2, fileLen) === 'ID') {
            console.log(data);
            // TODO: 判断是不是 【ID】 字段，【ID】 字段需要存 【Name】 的值
            target[filedName.substring(0, fileLen-2) + 'Name'] = data?.label;
        }
        form?.setFieldsValue(setFieldsVal);
        target.isChange = true;
        newData.splice(index, 1, target);
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
        if (val !== record.CurrencyID) {
            // TODO: 判断本地是否存在原币，账单币种的搭配汇率
            const currRateObj: ABillRateResult = currRateList.find((item: ABillRateResult) =>
                item.CurrencyOrig === record.CurrencyID && item.CurrencyABill === val
            ) || {};
            if (currRateObj.EXRateConvert) {
                // TODO: 有则拿前当前的；
                const data = {ExRate: currRateObj.EXRateConvert, ExRateStr: formatNumToMoney(currRateObj.EXRateConvert)}
                handleRowChange(index, record.CGID, 'ABillCurrencyTempID', val, data);
            } else {
                // TODO: 没有，则从后台获取
                // 当账单我听币种跟原币不一样时，从后台获取汇率
                const valueObj = {CurrencyOrig: record.CurrencyID, CurrencyABill: val, UserID: getUserID()};
                const options: any = {headers: {BranchID: getBranchID()}}
                fetch(`/api/ABill/GetABillEXRate?${stringify(valueObj)}`, options)
                    .then(response => response.json())
                    .then((result: any) => {
                        // TODO: 获取【原币到账单币种、账单币种到本位币】的汇率。
                        const data = {ExRate: result.EXRateConvert, ExRateStr: formatNumToMoney(result.EXRateConvert)};
                        // TODO: 把从后台获取的【原币、账单币搭配汇率】存到本地，供下次使用<下次不再调用接口>
                        const newCurrRateArr: ABillRateResult[] = ls.cloneDeep(currRateList);
                        newCurrRateArr.push({
                            CurrencyOrig: record.CurrencyID, CurrencyABill: val,
                            EXRateABill: result.EXRateABill, EXRateConvert: result.EXRateConvert
                        });
                        setCurrRateList(newCurrRateArr);
                        handleRowChange(index, record.CGID, 'ABillCurrencyTempID', val, data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        } else {
            handleRowChange(index, record.CGID, 'ABillCurrencyTempID', val, {ExRate: 1, ExRateStr: 1});
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
        const newCGData: APICGInfo[] = cgList.filter((item: APICGInfo) => item.CGID !== rowID) || [];
        setCGList(newCGData);
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
    const APHidden = CGType === 2;
    const renderTableTitle = (
        <div className={'ant-table-title-info'}>
            <div className={'ant-div-left'}>
                <span className={'ant-table-title-label'}>AR</span>
                <Space>
                    <Button onClick={() => handleCopy('same')}>Copy</Button>
                    <Button onClick={() => handleCopy('noSame')}>Copy to {CGType === 1 ? 'AP' : 'AR'}</Button>
                </Space>
            </div>
            <div className={'ant-div-right'}>
                <Space>
                    <Button hidden={APHidden} onClick={() => handleCopy('same')}>Credit Note</Button>
                    <Button hidden={APHidden} onClick={() => handleCopy('noSame')}>Debit Note</Button>
                </Space>
            </div>
        </div>
    );
    const renderTableFooter = (
        <div className={'ant-table-footer-info'}>
            <div className={'ant-div-left'}>
                <Space>
                    <span className={'ant-table-title-label'}>Total: </span>
                    <label>{}</label>
                </Space>
            </div>
            <div className={'ant-div-right'}>
                <Space>
                    <span className={'ant-table-title-label'}>Total HKD: </span>
                    <label>{}</label>
                </Space>
            </div>
        </div>
    );
    // endregion

    return (
        <Row gutter={24}>
            <Col span={24}>
                <Table
                    rowKey={'CGID'}
                    bordered={true}
                    pagination={false}
                    columns={cgColumns}
                    dataSource={cgList}
                    title={() => renderTableTitle}
                    footer={() => renderTableFooter}
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
export default ChargeTable;