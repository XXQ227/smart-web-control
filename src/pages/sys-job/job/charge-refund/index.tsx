import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import {Button, Form, message, Spin} from 'antd';
import {history, useModel, useParams} from 'umi';
import {getFormErrorMsg} from '@/utils/units';
import ChargeTable from '@/pages/sys-job/job/charge/charge-table';

const FormItem = Form.Item;

// TODO: 数据类型1
type APICGInfo = APIModel.PRCGInfo;

const ChargeRefund: React.FC<RouteChildrenProps> = () => {
    const urlParams: any = useParams();
    const jobId = atob(urlParams.id);
    //region TODO: 数据层
    const {
        queryChargesByJobId, saveCharges, submitCharges, rejectCharges,
    } = useModel('job.jobCharge', (res: any) => ({
        queryChargesByJobId: res.queryChargesByJobId,
        saveCharges: res.saveCharges,
        submitCharges: res.submitCharges,
        rejectCharges: res.rejectCharges,
    }));

    const {
        queryInvoiceTypeCommon, InvoTypeList,
    } = useModel('common', (res: any)=> ({
        queryInvoiceTypeCommon: res.queryInvoiceTypeCommon,
        InvoTypeList: res.InvoTypeList,
    }))
    //endregion

    /** 实例化Form */
    const [form] = Form.useForm();

    // TODO: 用来判断是否是第一次加载数据
    const [isReload, setIsReload] = useState<boolean>(false);

    // TODO: 用来判断是否是第一次加载数据
    const [loading, setLoading] = useState(false);

    const [refundARCGList, setRefundARCGList] = useState<APICGInfo[]>([]);
    const [refundAPCGList, setRefundAPCGList] = useState<APICGInfo[]>([]);

    // TODO: 选种的所有费用数据
    const [selectedKeyObj, setSelectedKeyObj] = useState<any>({});
    const [selectedRowObj, setSelectedRowObj] = useState<any>({});
    const [submitStatus, setSubmitStatus] = useState<any>({toManager: true, toBilling: true});

    useEffect(() => {

    }, [])

    async function handleQueryJobChargeInfo() {
        if (!loading) setLoading(true);
        if (InvoTypeList?.length === 0) {
            await queryInvoiceTypeCommon({branchId: '1665596906844135426', name: ''});
        }
        const result: API.Result = await queryChargesByJobId({id: jobId});
        setLoading(false);
        if (result.success) {
            const {refundAPChargeList, refundARChargeList} = result.data;
            setRefundARCGList(refundARChargeList);
            setRefundAPCGList(refundAPChargeList);
            setSelectedKeyObj({});
            setSelectedRowObj({});
            setSubmitStatus({toManager: true, toBilling: true});
            form.setFieldsValue({refundARCGList: refundARChargeList, refundAPCGList: refundAPChargeList});
            setIsReload(true);
            return result.data || {};
        } else {
            if (result.message) message.error(result.message);
            return {};
        }
    }

    /**
     * @Description: TODO: 操作数据
     * @author XXQ
     * @date 2023/4/11
     * @param data      操作后的数据
     * @param CGType    操作的 【AR / AP】
     * @param state     操作动作：TODO: 【copy: 复制】
     * @returns
     */
    const handleChangeData = (data: any, CGType: number, state?: any) => {
        // TODO: 此复制为反向复制，【ar => ap】 or 【ap => ar】
        if (state === 'copy') {
            if (CGType === 5) {
                const newData = refundAPCGList.slice(0);
                newData.push(...data);
                setRefundAPCGList(newData);
                form.setFieldsValue({refundAPCGList: newData});
            } else {
                const newData = refundARCGList.slice(0);
                newData.push(...data);
                setRefundARCGList(newData)
                form.setFieldsValue({refundARCGList: newData});
            }
            setIsReload(true);
        } else {
            if (CGType === 5) {
                setRefundARCGList(data);
            } else if (CGType === 6) {
                setRefundAPCGList(data);
            }
        }
    }

    /**
     * @Description: TODO: 处理所有选中的费用信息
     * @author XXQ
     * @date 2023/8/21
     * @param selectRowKeys     选中行的 id 集合
     * @param selectRows        选中的费用行
     * @param key               费用类型： 1：ar; 2、ap; 3、代收代付;
     * @returns
     */
    const handleChangeRows = (selectRowKeys: any[], selectRows: any[], key: string) => {
        selectedRowObj[key] = selectRows;
        selectedKeyObj[key] = selectRowKeys;
        //region TODO: 用来验证【提交按钮】的禁选状态
        const selectAllRows: any[] = [];
        if (selectedRowObj.refundArSelected) selectAllRows.push(...selectedRowObj.refundArSelected);
        if (selectedRowObj.refundApSelected) selectAllRows.push(...selectedRowObj.refundApSelected);
        // TODO: 【submitStatusObj】 按钮的判断状态值；
        const submitStatusObj: any = {toManager: true, toBilling: true,};
        if (selectAllRows?.length > 0) {
            const stateArr: number[] = selectAllRows.map((item: any) => item.state) || [];
            // TODO:
            if (stateArr.length > 0) {
                // TODO: 当存在【初始费用】时，【提交主管】按钮可操作
                if (stateArr.includes(1)) submitStatusObj.toManager = false;
                // TODO: 当存在【提交主管】时，【提交财务】按钮可操作
                if (stateArr.includes(2)) submitStatusObj.toBilling = false;
            }
        }
        setSubmitStatus(submitStatusObj);
        //endregion
        setSelectedKeyObj(selectedKeyObj);
        setSelectedRowObj(selectedRowObj);
    }


    /**
     * @Description: TODO:  费用提交主管、财务或 费用被主管、财务驳回
     * @author XXQ
     * @date 2023/9/5
     * @param type  TODO: 提交的类型： * 1：提交主管；* 2：提交财务；* 3:被主管驳回；* 4:被财务驳回
     * @returns
     */
    const handeSubmit = async (type: number) => {
        const allChargeArr: any[] = [];
        if (selectedKeyObj.refundArSelected) allChargeArr.push(...selectedRowObj.refundArSelected);
        if (selectedKeyObj.refundApSelected) allChargeArr.push(...selectedRowObj.refundApSelected);

        // TODO: 拿到提交操作对应的费用状态数据；【type === 3：费用驳回操作 => 数据拿提交主管的数据】
        const chargeState: number = type === 3 ? 2 : type;
        // TODO: 过滤费用数据
        const submitCGArr: any[] = allChargeArr.filter((item: any)=> item.state === chargeState) || [];

        if (submitCGArr?.length > 0) {
            // TODO: 拿到选中的 ar、ap 费用行 id,
            const idList: string[] = submitCGArr.map((item: any) => item.id) || [];
            const params: any = {idList, jobId, type, branchId: '1665596906844135426', taxMethod: 0};
            try {
                // TODO: 返回结果变量
                let result: API.Result;
                // TODO: 驳回费用
                if (type > 2) {
                    result = await rejectCharges(params);
                } else {
                    result = await submitCharges(params);
                }
                if (result.success) {
                    message.success('Success');
                    await handleQueryJobChargeInfo();
                    setSubmitStatus({toManager: true, toBilling: true});
                } else {
                    if (result.message) message.error(result.message);
                }
            } catch (e) {
                message.error(e);
            }
        } else {
            message.warning('There are currently no charges to submit.');
        }
    }

    /**
     * @Description: TODO: 保存费用操作
     * @author XXQ
     * @date 2023/4/11
     * @returns
     */
    const handleSave = async (values: any) => {
        form.validateFields()
            .then(async () => {
                setLoading(true);
                // @ts-ignore // TODO: 删除对应的 table 里的录入数据
                for (const item: string in values) {
                    if (item.indexOf('_table_') > -1) {
                        delete values[item];
                    }
                }
                const params = {
                    jobId, branchId: '1665596906844135426', taxMethod: 1,
                    ...values, chargeList: [],
                };

                if (params.refundARCGList?.length > 0) {
                    params.refundARCGList = params.refundARCGList.map((item: any)=>
                        ({...item, jobBusinessLine: 1, id: item.id.indexOf('ID_') > -1 ? '0' : item.id})
                    );
                    params.chargeList.push(...params.refundARCGList);
                    delete params.refundARCGList;
                }

                if (params.refundAPCGList?.length > 0) {
                    params.refundAPCGList = params.refundAPCGList.map((item: any)=>
                        ({...item, jobBusinessLine: 1, id: item.id.indexOf('ID_') > -1 ? '0' : item.id})
                    );
                    params.chargeList.push(...params.refundAPCGList);
                    delete params.refundAPCGList;
                }

                const result: API.Result = await saveCharges(params);
                if (result.success) {
                    message.success('Success');
                    await handleQueryJobChargeInfo();
                } else {
                    setLoading(false);
                    if (result.message) message.error(result.message);
                }
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {jobId, form, FormItem, InvoTypeList, handleChangeData, handleChangeRows};

    // console.log(refundARCGList);

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                name={'formCharge'}
                autoComplete={'off'}
                onFinish={handleSave}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar extra={<Button onClick={() => history.goBack()}>Back</Button>}>
                                <Button
                                    onClick={() => handeSubmit(1)}
                                    type={'primary'} disabled={submitStatus.toManager}
                                >Submit to Manager</Button>
                                <Button
                                    onClick={() => handeSubmit(2)}
                                    type={'primary'} disabled={submitStatus.toBilling}
                                >Submit to Billing</Button>
                                <Button
                                    onClick={() => handeSubmit(3)}
                                    type={'primary'} disabled={submitStatus.toBilling}
                                >Reject</Button>
                                <Button type={'primary'} htmlType={'submit'}>保存</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                request={async () => handleQueryJobChargeInfo()}
            >
                <ChargeTable
                    CGType={5}
                    title={'AR'}
                    {...baseCGDON}
                    isRefund={true}
                    isReload={isReload}
                    CGList={refundARCGList}
                    formName={'refundARCGList'}
                    handleChangeCopyState={()=> setIsReload(false)}
                />

                <ChargeTable
                    CGType={6}
                    title={'AP'}
                    {...baseCGDON}
                    isRefund={true}
                    isReload={isReload}
                    CGList={refundAPCGList}
                    formName={'refundAPCGList'}
                    handleChangeCopyState={()=> setIsReload(false)}
                />

            </ProForm>
        </Spin>
    )
}
export default ChargeRefund;