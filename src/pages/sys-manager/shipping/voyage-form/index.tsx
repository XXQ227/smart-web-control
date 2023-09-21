import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText, ProFormTextArea,
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {history, useModel} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import SearchProFormSelect from "@/components/SearchProFormSelect";

type APIVoyage = APIManager.Voyage;

const VoyageForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryVoyageInfo, addVoyage, editVoyage
    } = useModel('manager.shipping', (res: any) => ({
        queryVoyageInfo: res.queryVoyageInfo,
        addVoyage: res.addVoyage,
        editVoyage: res.editVoyage,
    }));

    const [VoyageInfoVO, setVoyageInfoVO] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * @Description: TODO: 获取 航次 详情
     * @author LLS
     * @date 2023/6/12
     * @returns
     */
    const handleGetVoyageInfo = async () => {
        setLoading(true);
        try {
            const result: API.Result = await queryVoyageInfo({id});
            if (result.success) {
                setVoyageInfoVO(result.data);
            } else {
                message.error(result.message);
            }
            setLoading(false);
            return result.data || {};
        } catch (errorInfo) {
            console.log(errorInfo);
            setLoading(false);
        }
    }

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/6/8
     * @param val
     * @returns
     */
    const onFinish = async (val: APIVoyage) => {
        setLoading(true);
        let result: API.Result;
        const param: any = {
            name: val.name,
            etd: val.etd,
            type: val.type,
            lineId: val.lineId,
            vesselId: val.vesselId,
            branchId: "1665596906844135426",
            remark: val.remark,
        };
        if (id === '0') {
            // TODO: 新增航次
            result = await addVoyage(param);
        } else {
            // TODO: 编辑航次
            param.id = id;
            result = await editVoyage(param);
        }
        if (result.success) {
            message.success('Success');
            if (id === '0') history.push({pathname: `/manager/shipping/voyage/form/${btoa(result.data)}`});
        } else {
            message.error(result.message)
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author LLS
     * @date 2023/6/8
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    return (
        <PageContainer
            loading={loading}
            header={{breadcrumb: {},}}
        >
            <ProForm
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={VoyageInfoVO}
                formKey={'voyage-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetVoyageInfo()}
            >
                <ProCard title={'Basic Information'}>
                    {/* TODO: Full Name、Short Name、Code、Manager */}
                    <Row gutter={24}>
                        <Col span={6}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Voyage'
                                name='name'
                                rules={[{required: true, message: 'Voyage is required'}]}
                            />
                        </Col>
                        <Col span={9}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                required={true}
                                label="Vessel Name"
                                id={'vesselId'}
                                name={'vesselId'}
                                url={'/apiBase/vessel/queryVesselCommon'}
                                valueObj={{value: VoyageInfoVO?.vesselId, label: VoyageInfoVO?.vesselName}}
                            />
                        </Col>
                        <Col span={9}>
                            <SearchProFormSelect
                                qty={5}
                                isShowLabel={true}
                                required={true}
                                label="Shipping Line"
                                id={'lineId'}
                                name={'lineId'}
                                url={'/apiBase/line/queryLineCommon'}
                                valueObj={{value: VoyageInfoVO?.lineId, label: VoyageInfoVO?.lineName}}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormSelect
                                required
                                name="type"
                                label="Direction"
                                placeholder=''
                                options={[
                                    {label: 'OUTBOUND', value: 1},
                                    {label: 'INBOUND', value: 2},
                                ]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormDatePicker
                                required
                                width='md'
                                placeholder=''
                                name="etd"
                                label="ETD"
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea
                                placeholder=''
                                fieldProps={{rows: 5}}
                                name="remark"
                                label="Remark"
                            />
                        </Col>
                    </Row>

                </ProCard>

                <FooterToolbar
                    extra={<Button onClick={() => history.push({pathname: '/manager/shipping'})}>Back</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default VoyageForm;