import React, {useEffect, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance, ProColumns} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormText,
    ProFormTextArea, ProTable
} from '@ant-design/pro-components'
import {Button, Col, Form, Row, Space} from 'antd'
import {useModel, history} from 'umi'
import DepartmentForm from '@/pages/sys-manager/branch/branch-form/department'
import {PlusOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {getUserID} from '@/utils/auths'
import {ID_STRING} from '@/utils/units'

type APIBranch = APIManager.Branch;
type APIDepartment = APIManager.Department;
const BranchForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    const {current} = formRef;
    //region TODO: 数据层
    const {
        getBranchInfo, BranchInfo,
    } = useModel('manager.branch', (res: any) => ({
        BranchInfo: res.BranchInfo,
        getBranchInfo: res.getBranchInfo,
    }));

    const [BranchInfoVO, setBranchInfoVO] = useState<APIBranch>(BranchInfo);
    const [DepartmentListVO, setDepartmentListVO] = useState<APIDepartment[]>(BranchInfo.DepartmentList || []);
    const [isChangeValue, setIsChangeValue] = useState<boolean>(false);


    //endregion

    useEffect(() => {
    }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetBranchInfo = async () => {
        const result: any = await getBranchInfo({ID: Number(atob(params?.id))});
        setBranchInfoVO(result);
        return result;
    }

    /**
     * @Description: TODO: 添加部门
     * @author XXQ
     * @date 2023/5/24
     * @param
     * @returns
     */
    const handleAddDept = () => {
        const newData: APIDepartment[] = ls.cloneDeep(DepartmentListVO);
        const deptObj: APIDepartment = {
            id: ID_STRING,
            name: '',
            parent_id: null,
            level: null,
            sort: null,
            charge_person: '',
            contact_phone: '',
            address: '',
            parent_ids: '',
            delete_flag: false,
            enable_flag: true,
            create_user_id: getUserID(),
            update_user_id: getUserID(),
        }
        newData.push(deptObj);
        setDepartmentListVO(newData);
    }

    /**
     * @Description: TODO: 当 ProForm 表单修改时，调用此方法
     * @author XXQ
     * @date 2023/5/8
     * @param changeValues   ProForm 表单修改的参数
     * @returns
     */
    const handleProFormValueChange = (changeValues: any) => {
        console.log(changeValues);
        if (!isChangeValue) {
            setIsChangeValue(true);
        }
        Object.keys(changeValues).map((item: any) => {
            const setFieldVal: any = {};
            current?.setFieldsValue(setFieldVal);
        })
    }


    //region TODO:
    //endregion

    return (
        <PageContainer
            // loading={false}
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
                initialValues={BranchInfoVO}
                formKey={'cv-center-information'}
                // TODO: 空间有改数据时触动
                onValuesChange={handleProFormValueChange}
                // TODO: 提交数据
                onFinish={async (values) => {
                    console.log(values);
                }}
                // TODO: 向后台请求数据
                // request={async () => handleGetBranchInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='name_full_en'
                                placeholder=''
                                tooltip='length: 100'
                                label='Company'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='name_full_local'
                                placeholder=''
                                tooltip='length: 100'
                                label='Company'
                                rules={[{required: true, message: 'is required'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='tax_num'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={2}>
                            <ProFormText
                                required
                                name='enable_flag'
                                placeholder=''
                                label='Freezen'
                                // tooltip='length: 30'
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='org_create_id'
                                placeholder=''
                                label='AUC Num'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={4}>
                            <ProFormText
                                required
                                name='org_id'
                                placeholder=''
                                label='Oracle ID'
                                tooltip='length: 30'
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormTextArea name='Address' placeholder='' label='address'/>
                        </Col>
                    </Row>
                </ProCard>

                <ProCard
                    title={'Department'} className={'ant-card ant-card-pro-table'}
                    extra={
                        <Button onClick={handleAddDept} type={'primary'} icon={<PlusOutlined/>}>
                            Add Department
                        </Button>
                }
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <DepartmentForm
                                DepartmentList={DepartmentListVO}
                            />
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/manager/branch/list'})}>返回</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default BranchForm;