import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import ChargeTemplateChargeTable from './charge-template-charge-table'
import ls from 'lodash'

const FormItem = Form.Item;

type APICGTemp = APIManager.CGTemp;
type CGTempItems = APIManager.CGTempItems;


const ChargeTemplateForm: React.FC<RouteChildrenProps> = () => {
    const params: any = useParams();
    const [form] = Form.useForm();
    const {push, location: {pathname}} = history;
    const formRef = useRef<ProFormInstance>();
    const id = atob(params?.id);

    const {
        addChargeTemplate, queryChargeTemplateInfo, editChargeTemplate,
    } = useModel('manager.charge-template', (res: any) => ({
        addChargeTemplate: res.addChargeTemplate,
        queryChargeTemplateInfo: res.queryChargeTemplateInfo,
        editChargeTemplate: res.editChargeTemplate,
    }));

    const {
        queryDictDetailCommon, queryDictCommon, ServicesList, PurposeofCallList
    } = useModel('common', (res: any)=> ({
        queryDictCommon: res.queryDictCommon,
        queryDictDetailCommon: res.queryDictDetailCommon,
        ServicesList: res.ServicesList,
        PurposeofCallList: res.PurposeofCallList,
    }))

    const [loading, setLoading] = useState<boolean>(false);
    const [CGTempInfoVO, setCGTempInfoVO] = useState<any>({});
    const [ARListVO, setARListVO] = useState<CGTempItems[]>([]);
    const [APListVO, setAPListVO] = useState<CGTempItems[]>([]);

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetCGTempByID(paramsVal: APICGTemp) {
        if (ServicesList?.length === 0 || PurposeofCallList?.length === 0) {
            // await queryDictCommon({dictCodes: ['services', 'purpose_of_call']});
            // await queryDictDetailCommon({dictCode: 'services', currentPage: 1, pageSize: 35});
        }
        if (id !== '0') {
            setLoading(true);
            const result: API.Result = await queryChargeTemplateInfo(paramsVal);
            setLoading(false);
            return result;
        } else {
            return {};
        }
    }

    /**
     * @Description: TODO: onChange 事件
     * @author XXQ
     * @date 2023/5/9
     * @param data      字段名
     * @param CGType    结果
     * @returns
     */
    const handleCGTempChange = (data: CGTempItems[], CGType: number) => {
        if (CGType === 1) {
            setARListVO(data);
        } else {
            setAPListVO(data);
        }
    }

    const handleSave = async (values: any) => {
        setLoading(true);
        const saveId = pathname.indexOf('/copy') > -1 ? 0 : id;
        const saveResult: any = {
            id: saveId,
            branchId: 0,
            ...values,
        };
        // TODO: 模板费用保存，字符串的费用 id 变成 0
        let arList: CGTempItems[] = ls.cloneDeep(ARListVO),
            apList: CGTempItems[] = ls.cloneDeep(APListVO);
        // let chargeTemplateItemList: CGTempItems[];
        // if (arList?.length > 0) {
        //     arList.map((item: CGTempItems) => {
        //         if (item.id && item.id.indexOf('ID_') > -1) {
        //             delete item.id;
        //         }
        //         item.type = 1;
        //         chargeTemplateItemList.push(item);
        //     })
        // }
        // if (apList?.length > 0) {
        //     apList.map((item: CGTempItems) => {
        //         if (item.id && item.id.indexOf('ID_') > -1) {
        //             delete item.id;
        //         }
        //         item.type = 1;
        //         chargeTemplateItemList.push(item);
        //     })
        // }
        arList = arList.map((item: CGTempItems) => ({...item, type: 1, id: item.id && item.id.indexOf('ID_') > -1 ? '' : item.id})) || [];
        apList = apList.map((item: CGTempItems) => ({...item, type: 2, id: item.id && item.id.indexOf('ID_') > -1 ? '' : item.id})) || [];
        // TODO: 费用模板里的 AR、AP 费用
        saveResult.chargeTemplateItemList = [...arList, ...apList];
        let result: API.Result;
        if (saveId === '0') {
            result = await addChargeTemplate(saveResult);
        } else {
            result = await editChargeTemplate(saveResult);
        }
        setLoading(false);
        if (result.success) {
            message.success('Success!');
        } else {
            message.error(result.message);
        }
    }


    // TODO: 传给子组件的参数
    const baseCGDON: any = {
        form, formRef, FormItem, handleCGTempChange,
    };

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
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                // @ts-ignore
                request={async () => handleGetCGTempByID({id})}
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
                        {/*<Col span={3}>
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
                        </Col>*/}
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='serviceType'
                                label='Services'
                                options={ServicesList}
                            />
                        </Col>
                        <Col span={5}>
                            <ProFormSelect
                                placeholder=''
                                name='PurposeofCallID'
                                label='Purpose of call'
                                options={PurposeofCallList}
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
                                // InvoTypeList={ARInvoTypeList}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <FormItem label={APListVO} name={'APListVO'}>
                                <ChargeTemplateChargeTable
                                    CGType={1}
                                    label={'AP'}
                                    {...baseCGDON}
                                    CGList={APListVO}
                                    // InvoTypeList={APInvoTypeList}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => push({pathname: '/manager/charge-template'})}>返回</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default ChargeTemplateForm;