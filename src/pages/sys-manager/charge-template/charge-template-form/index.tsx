import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getUserID} from '@/utils/auths'
import {getFormErrorMsg} from '@/utils/units'
import ChargeTemplateChargeTable from './charge-template-charge-table'


type APICGTemp = APIManager.CGTemp;
type CGTempItems = APIManager.CGTempItems;


const ChargeTemplateForm: React.FC<RouteChildrenProps> = (props) => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
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
        if (!(CGTempInfoVO?.ID) && !!(CGTempInfo.ID)) {
            setCGTempInfoVO(CGTempInfo);
            setARListVO(CGTempInfo.ARList);
            setAPListVO(CGTempInfo.APList);
        }
    }, [CGTempInfo, CGTempInfoVO?.ID])

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCGTempByID(paramsVal: APIManager.CGTempByIDParams) {
        setLoading(true);
        const result: any = await getVOByID(paramsVal);
        setCGTempInfoVO(result.CGTempVO);
        setARListVO(result.ARList);
        setAPListVO(result.APList);
        setLoading(false);
        return result;
    }

    const handleSave = async (values: any) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                values.ID = ID;
                const result: any = await saveCGTemp(values);
                if (result.Result) {
                    message.success('Success!');
                } else {
                    message.error(result.Content);
                }
                setLoading(false);
            })
            .catch((errorInfo) => {
                /** TODO: 错误信息 */
                message.error(getFormErrorMsg(errorInfo));
            });
        setLoading(false);
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
        if (['CityID', 'CountryID'].includes(filedName)) {
            formRef?.current?.setFieldsValue({[filedName]: val.value});
        }
    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {form, formRef, handleCGTempChange, CurrencyList, PayMethodList};

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={CGTempInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                // onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={handleSave}
                onFinishFailed={handleSave}
                params={{UserID: getUserID(), ID}}
                // TODO: 向后台请求数据
                // @ts-ignore
                request={async (paramsVal: APIManager.CGTempByIDParams) => handleGetCGTempByID(paramsVal)}
            >
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
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
            </ProForm>
        </PageContainer>
    )
}
export default ChargeTemplateForm;