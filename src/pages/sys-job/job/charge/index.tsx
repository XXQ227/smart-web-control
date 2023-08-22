import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import {Button, Form, message, Spin} from 'antd';
import {history, useModel, useParams} from 'umi';
import {getFormErrorMsg} from '@/utils/units';
import ChargeTable from '@/pages/sys-job/job/charge/chargeTable';
import Agent from '@/pages/sys-job/job/charge/agent';

const FormItem = Form.Item;

// TODO: 数据类型1
type APICGInfo = APIModel.PRCGInfo;

const JobChargeInfo: React.FC<RouteChildrenProps> = () => {
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

    const [payCGList, setPayCGList] = useState<APICGInfo[]>([]);
    const [receiveCGList, setReceiveCGList] = useState<APICGInfo[]>([]);
    const [proxyCGList, setProxyCGList] = useState<APICGInfo[]>([]);

    const [selectedKeyObj, setSelectedKeyObj] = useState<any>({});
    const [selectedRowObj, setSelectedRowObj] = useState<any>({});

    const [isCopyNoSame, setIsCopyNoSame] = useState<boolean>(false);

    useEffect(() => {

    }, [])

    async function handleQueryJobChargeInfo() {
        setLoading(true);
        if (InvoTypeList?.length === 0) {
            await queryInvoiceTypeCommon({branchId: '1665596906844135426', name: ''});
        }
        const result: API.Result = await queryChargesByJobId({id: jobId});
        setLoading(false);
        if (result.success) {
            const {chargeAPList, chargeARList,  reimbursementChargeList} = result.data;
            setPayCGList(chargeAPList || []);
            setReceiveCGList(chargeARList || []);
            setProxyCGList(reimbursementChargeList || []);
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
                const newData = payCGList.slice(0);
                newData.push(...data);
                setPayCGList(newData);
                form.setFieldsValue({payCGList: newData});
            } else {
                const newData = receiveCGList.slice(0);
                newData.push(...data);
                setReceiveCGList(newData)
                form.setFieldsValue({receiveCGList: newData});
            }
            setIsCopyNoSame(true);
        } else {
            if (CGType === 1) {
                setReceiveCGList(data);
            } else {
                setPayCGList(data);
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
                // @ts-ignore // TODO: 删除对应的 table 里的录入数据
                for (const item: string in values) {
                    if (item.indexOf('_table_') > -1) {
                        delete values[item];
                    }
                }
                // console.log(selectedKeyObj, selectedRowObj);
                const params = {
                    jobId, branchId: '1665596906844135426', taxMethod: 1,
                    ...values, chargeList: [],
                };

                if (params.receiveCGList?.length > 0) {
                    params.receiveCGList = params.receiveCGList.map((item: any)=>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id})
                    );
                    params.chargeList.push(...params.receiveCGList);
                    delete params.receiveCGList;
                }

                if (params.payCGList?.length > 0) {
                    params.payCGList = params.payCGList.map((item: any)=>
                        ({...item, id: item.id.indexOf('ID_') > -1 ? '0' : item.id})
                    );
                    params.chargeList.push(...params.payCGList);
                    delete params.payCGList;
                }

                if (params.reimbursementChargeList?.length > 0) {
                    params.reimbursementChargeList = params.reimbursementChargeList.map((item: any)=>
                        ({...item, receiveId: item.receiveId.indexOf('ID_') > -1 ? '0' : item.id})
                    );
                }

                const result: API.Result = await saveCharges(params);
                if (result.success) {
                    message.success('success');
                    await handleQueryJobChargeInfo();
                } else {
                    if (result.message) message.error(result.message);
                }
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {jobId, form, FormItem, InvoTypeList, handleChangeData, handleChangeRows};

    // console.log(receiveCGList);

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                name={'formCharge'}
                autoComplete={'off'}
                onFinish={handleSave}
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
                    CGType={1}
                    title={'AR'}
                    {...baseCGDON}
                    CGList={receiveCGList}
                    formName={'payCGList'}
                    isCopyNoSame={isCopyNoSame}
                    handleChangeCopyState={()=> setIsCopyNoSame(false)}
                />

                <ChargeTable
                    CGType={2}
                    title={'AP'}
                    {...baseCGDON}
                    CGList={payCGList}
                    formName={'receiveCGList'}
                    isCopyNoSame={isCopyNoSame}
                    handleChangeCopyState={()=> setIsCopyNoSame(false)}
                />

                <Agent
                    CGType={3}
                    {...baseCGDON}
                    CGList={proxyCGList}
                />

                <FooterToolbar extra={<Button onClick={() => history.goBack()}>Back</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>保存</Button>
                </FooterToolbar>
            </ProForm>
        </Spin>
    )
}
export default JobChargeInfo;