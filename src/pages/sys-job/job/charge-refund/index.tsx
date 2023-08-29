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
        queryChargesByJobId, saveCharges
    } = useModel('job.jobCharge', (res: any) => ({
        queryChargesByJobId: res.queryChargesByJobId,
        saveCharges: res.saveCharges,
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
    const [loading, setLoading] = useState(false);

    const [refundARCGList, setRefundARCGList] = useState<APICGInfo[]>([]);
    const [refundAPCGList, setRefundAPCGList] = useState<APICGInfo[]>([]);

    const [selectedKeyObj, setSelectedKeyObj] = useState<any>({});
    const [selectedRowObj, setSelectedRowObj] = useState<any>({});

    const [isReload, setIsReload] = useState<boolean>(false);

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
            if (CGType === 1) {
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
            if (CGType === 1) {
                setRefundARCGList(data);
            } else if (CGType === 2) {
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
        selectedKeyObj[key] = selectRowKeys;
        selectedRowObj[key] = selectRows;
        setSelectedKeyObj(selectedKeyObj);
        setSelectedRowObj(selectedRowObj);
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
                    message.success('success');
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
                    isReturn={true}
                    isReload={isReload}
                    CGList={refundARCGList}
                    formName={'refundARCGList'}
                    handleChangeCopyState={()=> setIsReload(false)}
                />

                <ChargeTable
                    CGType={6}
                    title={'AP'}
                    {...baseCGDON}
                    isReturn={true}
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