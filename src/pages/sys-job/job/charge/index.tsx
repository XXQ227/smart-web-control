import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard, ProForm} from '@ant-design/pro-components';
import {Button, Col, Form, message, Row} from 'antd';
import {history, useModel, useParams} from 'umi';
import {getFormErrorMsg} from '@/utils/units';
import ChargeTable from '@/pages/sys-job/job/charge/chargeTable';
import Agent from '@/pages/sys-job/job/charge/agent';

const FormItem = Form.Item;

// TODO: 数据类型1
type APICGInfo = APIModel.PRCGInfo;

let isLoadingData = false;
const JobChargeInfo: React.FC<RouteChildrenProps> = (props) => {
    const params: any = useParams();
    const id = atob(params.id);
    //region TODO: 数据层
    const {
        JobChargeInfo: {PayCGList, ReceiveCGList, ProxyCGList}, getCJobCGByID
    } = useModel('job.jobCharge', (res: any) => ({
        JobChargeInfo: res.JobChargeInfo,
        getCJobCGByID: res.getCJobCGByID,
    }));
    //endregion

    /** 实例化Form */
    const [form] = Form.useForm();

    // TODO: 用来判断是否是第一次加载数据
    const [loading, setLoading] = useState(false);

    const [payCGList, setPayCGList] = useState<APICGInfo[]>(PayCGList || []);
    const [receiveCGList, setReceiveCGList] = useState<APICGInfo[]>(ReceiveCGList || []);
    const [proxyCGList, setProxyCGList] = useState<APICGInfo[]>(ProxyCGList || []);
    const [updateState, setUpdateState] = useState(false);

    useEffect(() => {

    }, [])

    async function handleQueryJobChargeInfo() {
        alert('loading job charge info !!!');
        return {};
    }

    /**
     * @Description: TODO: 操作数据
     * @author XXQ
     * @date 2023/4/11
     * @param data      操作后的数据
     * @param CGType    操作的 【AR / AP】
     * @returns
     */
    const handleChangeData = (data: any, CGType: number) => {
        if (CGType === 1) {
            setReceiveCGList(data);
        } else {
            setPayCGList(data);
        }
        setUpdateState(true);
    }

    /**
     * @Description: TODO: 保存费用操作
     * @author XXQ
     * @date 2023/4/11
     * @returns
     */
    const handleSave = async (values: any) => {
        console.log(values);
        form.validateFields()
            .then(async () => {
                /** 正确后的验证信息 */
                if (updateState) {
                    const apChangeList: APICGInfo[] = payCGList.filter((item: APICGInfo)=> item.isChange) || [];
                    const arChangeList: APICGInfo[] = receiveCGList.filter((item: APICGInfo)=> item.isChange) || [];
                    const proxyChangeList: APICGInfo[] = proxyCGList.filter((item: APICGInfo)=> item.isChange) || [];
                    const isChangeCG: APICGInfo[] = [...arChangeList, ...apChangeList, ...proxyChangeList];
                    console.log(isChangeCG, arChangeList );
                } else {
                    message.info('没有需要保存的数据');
                }
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {form, FormItem, handleChangeData};

    /*const initialValues = {
        table: {
            ar: receiveCGList,
            ap: payCGList,
        },
        arTable: receiveCGList,
        apTable: payCGList,
    };*/

    // console.log(receiveCGList)
    // console.log(initialValues)

    return (
        <ProForm
            form={form}
            name={'formCharge'}
            autoComplete={'off'}
            onFinish={handleSave}
            onFinishFailed={handleSave}
            // initialValues={initialValues}
            // @ts-ignore
            request={async () => handleQueryJobChargeInfo()}
        >
            <ProCard
                title={'AR'}
                bordered={true}
                headerBordered
                className={'ant-card'}
            >
                <Row gutter={24} className={'ant-margin-bottom-24'}>
                    <Col span={24}>
                        <ChargeTable
                            CGType={1}
                            {...baseCGDON}
                            CGList={receiveCGList}
                        />
                    </Col>
                </Row>
            </ProCard>

            <ProCard
                title={'AP'}
                bordered={true}
                headerBordered
                className={'ant-card'}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <ChargeTable
                            CGType={2}
                            {...baseCGDON}
                            CGList={payCGList}
                        />
                    </Col>
                </Row>
            </ProCard>

            <ProCard
                title={'Reimbursement'}
                bordered={true}
                headerBordered
                className={'ant-card'}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Agent
                            CGType={3}
                            {...baseCGDON}
                            CGList={proxyCGList}
                        />
                    </Col>
                </Row>
            </ProCard>
            <FooterToolbar extra={<Button onClick={() => history.goBack()}>Back</Button>}>
                <Button type={'primary'} htmlType={'submit'}>保存</Button>
            </FooterToolbar>
        </ProForm>
    )
}
export default JobChargeInfo;