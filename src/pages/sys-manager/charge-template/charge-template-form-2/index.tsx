import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getUserID} from '@/utils/auths'
import {getFormErrorMsg} from '@/utils/units'
import ChargeTemplateChargeTable from './charge-template-charge-table'

const FormItem = Form.Item;

type APICGTemp = APIManager.CGTemp;
type CGTempItems = APIManager.CGTempItems;

let isLoadingData = true;
const ChargeTemplateForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const ID = Number(atob(params?.id));

    const {
        CGTempInfo, getVOByID, PurposeOfCallList, ServicesList, saveCGTemp, CurrencyList, PayMethodList
    } = useModel('manager.charge-template', (res: any) => ({
        getVOByID: res.getVOByID,
        CGTempInfo: res.CGTempInfo,
        CurrencyList: res.CurrencyList,
        PayMethodList: res.PayMethodList,
        PurposeOfCallList: res.PurposeOfCallList,
        ServicesList: res.ServicesList,
        saveCGTemp: res.saveCGTemp,
    }));

    const [CGTempInfoVO, setCGTempInfoVO] = useState<APICGTemp>(CGTempInfo);
    const [ARListVO, setARListVO] = useState<CGTempItems[]>(CGTempInfo.CGTempItems || []);
    const [APListVO, setAPListVO] = useState<CGTempItems[]>(CGTempInfo.CGTempItems || []);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isLoadingData) {
            handleGetCGTempByID()
        }
    }, [handleGetCGTempByID])

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCGTempByID() {
    // const handleGetCGTempByID = async (values: any) => {
        setLoading(true);
        const result: any = await getVOByID({UserID: getUserID(), ID});
        setCGTempInfoVO(result.CGTempVO);
        setARListVO(result.ARList);
        setAPListVO(result.APList);
        setLoading(false);
        isLoadingData = false;
        // return result;
    }

    const handleSave = (values: any) => {
        console.log(values);
        setLoading(true);
        form.validateFields()
            .then(async () => {
                // values.ID = ID;
                // console.log(values);
                // const result: any = await saveCGTemp(values);
                // if (result.Result) {
                //     message.success('Success!');
                // } else {
                //     message.error(result.Content);
                // }
                setLoading(false);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
                setLoading(false);
            });
    }

    /**
     * @Description: TODO: onChange 事件
     * @author XXQ
     * @date 2023/5/9
     * @param filedName     字段名
     * @param val           结果
     * @returns
     */
    const handleCGTempChange = (filedName: string, val: any) => {

    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {form, FormItem, handleCGTempChange, CurrencyList, PayMethodList};

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <Form
                form={form}
                layout={'vertical'}
                autoComplete={'off'}
                name={'form-charge-template'}
                // TODO: 设置默认值
                initialValues={CGTempInfoVO}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={handleSave}
            >
                {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='Name'
                                placeholder=''
                                label='Template Name'
                                rules={[{required: true, message: 'Template Name is required'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='APUSDRate'
                                label='AP USD Rate'
                                rules={[{required: true, message: 'AP USD Rate is required'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='ARUSDRate'
                                label='AR USD Rate'
                                rules={[{required: true, message: 'AP USD Rate is required'}]}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='ServicesID'
                                label='Services'
                                options={ServicesList}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='PurposeofCallID'
                                label='Purpose of call'
                                options={PurposeOfCallList}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <ProCard className={'ant-card'}>
                    <Row gutter={24} style={{marginBottom: 24}}>
                        <Col span={24}>
                            <ChargeTemplateChargeTable
                                CGType={1}
                                label={'AR'}
                                {...baseCGDON}
                                CGList={ARListVO}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <ChargeTemplateChargeTable
                                CGType={1}
                                label={'AP'}
                                {...baseCGDON}
                                CGList={APListVO}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => history.push({pathname: '/manager/charge-template/list'})}>返回</Button>}>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </Form>
        </PageContainer>
    )
}
export default ChargeTemplateForm;