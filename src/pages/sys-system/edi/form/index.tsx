import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSelect, ProFormText,} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import EDIMapperIndex from '@/pages/sys-system/edi/form/edi-mapper'

const FormItem = Form.Item;

type APIEDI = APISystem.EDI;
const EDIForm: React.FC<RouteChildrenProps> = () => {
    const urlParams: any = useParams();
    const [form] = Form.useForm();
    const [form_ctn] = Form.useForm();
    const {push, location: {pathname}} = history;
    const id = atob(urlParams?.id);

    const {
        queryEDIInfo, editEDI, addEDI,
    } = useModel('system.edi', (res: any) => ({
        addEDI: res.addEDI,
        queryEDIInfo: res.queryEDIInfo,
        editEDI: res.editEDI,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [EDIInfoVO, setEDIInfoVO] = useState<any>({});
    const [formData, setFormData] = useState<any>({});

    // TODO: 因为存在数据库里的字符 [\"] 会变成 [&quot;]；因此在此需要被转回来
    const getMapperInfo = (mapperStr: string) => JSON.parse(mapperStr.replace(/&quot;/g, '\"'))

    /**
     * @Description: TODO: 获取 港口 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    async function handleGetEDIByID(paramsVal: APIEDI) {
        setLoading(true);
        const result: API.Result = await queryEDIInfo(paramsVal);
        setLoading(false);
        if (result.success) {
            const mapperDataInfo: any = {ctnModelMapper: [], pkgTypeMapper: [], serviceTypeMapper: [], portMapper: []};

            // region TODO: 因为存在数据库里的字符 [\"] 会变成 [&quot;]；因此在此需要被转回来
            if (result.data.ctnModelMapper) {
                mapperDataInfo.ctnModelMapper = result.data.ctnModelMapper = getMapperInfo(result.data.ctnModelMapper);
            }
            if (result.data.pkgTypeMapper) {
                mapperDataInfo.pkgTypeMapper = result.data.pkgTypeMapper = getMapperInfo(result.data.pkgTypeMapper);
            }
            if (result.data.serviceTypeMapper) {
                mapperDataInfo.serviceTypeMapper = result.data.serviceTypeMapper = getMapperInfo(result.data.serviceTypeMapper);
            }
            if (result.data.portMapper) {
                mapperDataInfo.portMapper = result.data.portMapper = getMapperInfo(result.data.portMapper);
            }
            setFormData(mapperDataInfo);
            // endregion
            result.data.shipmentType = {value: 1, label: 'Export'};
            setEDIInfoVO(result.data);
            return result.data;
        } else {
            message.error(result.message);
        }
    }

    /**
     * @Description: TODO:
     * @author XXQ
     * @date 2023/6/14
     * @param formKey 编辑的表单值
     * @param allValues 当前 form 所有的参数
     * @returns
     */
    const handleFormValuesChange = (formKey: string,  allValues: any) => {
        // 更新对应表单的数据
        setFormData((prevData: any) => ({...prevData, [formKey]: allValues}));
    };


    const handleSave = async (values: any) => {
        setLoading(true);
        const saveId = pathname.indexOf('/copy') > -1 ? '0' : id;
        let saveResult: any = values;
        saveResult = {
            ...saveResult,
            branchId: 0,
            receiverId: 0,
            ctnModelMapper: null,
            pkgTypeMapper: null,
            serviceTypeMapper: null,
            portMapper: null,
        };
        delete saveResult.shipmentType;
        console.log(formData);
        if (Object.keys(formData)?.length > 0) {
            Object.keys(formData)?.map(item=> {
                // TODO: 循环每一个编辑的数组
                if (formData[item]?.length > 0) {
                    let arrStr: string = '[';
                    if (formData[item]?.length > 0) {
                        formData[item].map((x: any)=> {
                            arrStr += (arrStr === '[' ? '' : ',') + JSON.stringify(x);
                        });
                        arrStr += ']';
                    }
                    // saveResult[item] = JSON.stringify(formData[item]);
                    // TODO: 给保存数据重新赋值
                    saveResult[item] = arrStr;
                }
            });
        }
        console.log(saveResult);
        let result: API.Result;
        if (saveId !== '0') {
            saveResult.id = saveId;
            result = await editEDI(saveResult);
        } else {
            result = await addEDI(saveResult);
        }
        setLoading(false);
        if (result.success) {
            if(saveId === '0') history.push({pathname: `/manager/edi/form/${btoa(result.data)}`});
            message.success('Success!');

        } else {
            message.error(result.message);
        }
    }

    // TODO: 传给子组件的参数
    const baseCGDON: any = {FormItem, handleFormValuesChange,};

    return (
        <PageContainer
            loading={loading}
            header={{breadcrumb: {}}}
        >
            <ProForm
                form={form}
                name={'edi'}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={EDIInfoVO}
                formKey={'edi-information'}
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
                request={async () => id !== '0' ? handleGetEDIByID({id}) : {}}
            >
                {/** // TODO: Template Name、AP USD Rate、AR USD Rate、Services、Purpose of call */}
                <ProCard title={'Basic Info'} className={'ant-card'}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='name'
                                label='Name'
                                placeholder=''
                                tooltip={'length: 60'}
                                rules={[
                                    {required: true, message: 'Name is required'},
                                    {max: 60, message: 'Name length: 60'}
                                ]}
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                placeholder=''
                                name='bookingNoPrefixes'
                                label='Booking No. Prefixes'
                                tooltip={'length: 10'}
                                rules={[
                                    {required: true, message: 'Booking No. Prefixes is required'},
                                    {max: 10, message: 'Booking No. Prefixes length: 10'}
                                ]}
                            />
                        </Col>
                        {/*</Row>*/}
                        {/*<Row gutter={24}>*/}
                        <Col span={3}>
                            <ProFormSelect
                                required
                                placeholder=''
                                name='shipmentType'
                                label='Shipment Type'
                                rules={[{required: true, message: 'Shipment Type'},]}
                                options={[{value: 1, label: 'Export'}, {value: 2, label: 'Import'}]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='senderCode'
                                label='Sender Code'
                                tooltip={'length: 10'}
                                rules={[
                                    {required: true, message: 'Sender Code is required'},
                                    {max: 10, message: 'Sender Code length: 10'}
                                ]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='receiverCode'
                                label='Receiver Code'
                                tooltip={'length: 30'}
                                rules={[
                                    {required: true, message: 'Receiver Code is required'},
                                    {max: 30, message: 'Receiver Code length: 30'}
                                ]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='signerCode'
                                label='Signer Code'
                                tooltip={'length: 20'}
                                rules={[
                                    {required: true, message: 'Signer Code is required'},
                                    {max: 20, message: 'Signer Code length: 20'}
                                ]}
                            />
                        </Col>
                        <Col span={3}>
                            <ProFormText
                                required
                                placeholder=''
                                name='cutNum'
                                label='Cut Num'
                                tooltip={'length: 10'}
                                rules={[
                                    {required: true, message: 'Cut Num is required'},
                                    // {max: 10, message: 'Cut Num length: 10'}
                                ]}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar
                    extra={<Button
                        onClick={() => push({pathname: '/system/edi/list'})}>Back</Button>}>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FooterToolbar>
            </ProForm>

            <ProCard className={'ant-card ant-card-pro-table'}>
                <Row gutter={24} style={{marginBottom: 24}}>
                    <Col span={12}>
                        <EDIMapperIndex
                            form={form_ctn}
                            type={'ctn'}
                            name={'ctnModelMapper'}
                            label={'Container Size'}
                            {...baseCGDON}
                            dataSouse={formData.ctnModelMapper}
                            oldDataSouse={EDIInfoVO.ctnModelMapper}
                        />
                    </Col>
                    <Col span={12}>
                        <EDIMapperIndex
                            type={'pkg'}
                            name={'pkgTypeMapper'}
                            label={'Package Type'}
                            {...baseCGDON}
                            dataSouse={formData.pkgTypeMapper}
                            oldDataSouse={formData.pkgTypeMapper}
                        />
                    </Col>
                </Row>
                <Row gutter={24} style={{marginBottom: 24}}>
                    <Col span={12}>
                        <EDIMapperIndex
                            {...baseCGDON}
                            type={'trans'}
                            name={'serviceTypeMapper'}
                            label={'Service Type'}
                            dataSouse={formData.serviceTypeMapper}
                            oldDataSouse={formData.serviceTypeMapper}
                        />
                    </Col>
                    <Col span={12}>
                        <EDIMapperIndex
                            type={'port'}
                            label={'Port'}
                            {...baseCGDON}
                            name={'portMapper'}
                            dataSouse={formData.portMapper}
                            oldDataSouse={formData.portMapper}
                        />
                    </Col>
                </Row>
            </ProCard>
        </PageContainer>
    )
}
export default EDIForm;