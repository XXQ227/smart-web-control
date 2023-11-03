import React, {Fragment, useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance, ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProForm, ProFormSwitch, ProFormText, ProTable} from '@ant-design/pro-components'
import {Button, Col, Form, Input, message, Popconfirm, Row, Space, Spin} from 'antd'
import {history, useModel, useParams} from 'umi'
import {getChildrenListData, getFormErrorMsg, IconFont, ID_STRING} from '@/utils/units'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSwitch from '@/components/FormItemComponents/FormItemSwitch'
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import DividerCustomize from '@/components/Divider'
import ls from 'lodash'

const {Search} = Input;

const AuthResourceForm: React.FC<RouteChildrenProps> = () => {
    const {location} = history;
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryAuthResourceTree, editAuthResource, deleteAuthResource, addAuthResource
    } = useModel('system.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree, editAuthResource: res.editAuthResource,
        deleteAuthResource: res.deleteAuthResource, addAuthResource: res.addAuthResource,
    }));

    const [authId, setAuthId] = useState<string>(id);
    const [authInfoVO, setAuthInvoVO] = useState<any>({id});
    const [authChildListVO, setAuthChildListVO] = useState<any[]>([]);
    const [redirectVal, setRedirectVal] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(false);
    //endregion

    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleQueryAuthResourceTree = async (params: any) => {
        setLoading(true);
        const result: API.Result = await queryAuthResourceTree(params);
        if (result.data) result.data = getChildrenListData(result.data);
        const authResult = result.data[0] || {};
        authResult.type = authResult.type === 2;
        // TODO: 保存子集权限数据
        setAuthChildListVO(authResult.children);
        // TODO: 存下当前数据详情
        setAuthInvoVO(authResult);
        // TODO: 重置表单数据
        form.setFieldsValue(authResult);
        setLoading(false);
        return authResult;
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: any) => {
        for (const item in val) {
            if (item.indexOf('_table_') > -1) {
                delete val[item];
            }
        }
        const params: any = {
            id, ...val, type: val.type ? 2 : 1,
            parentId: authInfoVO.parentId, parentIds: authInfoVO.parentIds
        };
        const result: API.Result = await editAuthResource(params);
        if (result.success) {
            message.success('Success');
        } else {
            message.error(result.message);
        }
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        message.error(getFormErrorMsg(val) || '');
    }

    const handleViewChildAuth = (record: any, isBack?: boolean) => {
        form.resetFields();
        let backUrl = '/system/authority/auth';
        if (isBack) {
            console.log(location.pathname.indexOf('/level2/') > -1);
            // TODO: 判断是否是二级菜单
            if (location.pathname.indexOf('/level2/') > -1) {
                backUrl += '/form/' + btoa(record.parentId || record.parentIds || record.id || '0');
                setAuthId(record.parentId || record.parentIds || record.id);
            }
        } else {
            backUrl += `/level2/${record.pathName}/form/${btoa(record.id)}`;
            setAuthId(record.id);
        }
        history.push({pathname: backUrl});
        setLoading(true);
    }

    //region TODO:
    const setChildAuthFunc = (index = 0, deleteCount = 0, record?: any) => {
        const newData: any[] = ls.cloneDeep(authChildListVO) || [];
        if (record) {
            newData.splice(index, deleteCount, record);
        } else {
            newData.splice(index, deleteCount);
        }
        setAuthChildListVO(newData);
    }

    // TODO: 添加权限
    const handleAddAuth = () => {
        const addDataObj: any = {
            id: ID_STRING(), isChange: true,
            name: '', url: '', pathName: '', pathUrl: authInfoVO.pathUrl + '/', type: false,
            enableFlag: 0, identityCode: authInfoVO.identityCode + '_', icon: 'icon-',  parentId: authInfoVO.id || '',
            // TODO: parentId：上一层的 id；parentIds：上一层的 parentIds + 上一层自己的 id
            parentIds: (authInfoVO.parentIds || '') + (authInfoVO.parentIds ? ',' : '') + authInfoVO.id
        };
        setChildAuthFunc(0,0, addDataObj);
    }

    /**
     * @Description: TODO: 编辑当前行
     * @author XXQ
     * @date 2023/6/9
     * @param index     当前行序号
     * @param record    操作行数据
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleChangeAuthResource = (index: number, record: any, filedName: string, val: any) => {
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        if (filedName === 'type') {
            record.pathName = '';
            record.pathUrl = val ? '' : authInfoVO.pathUrl + '/';
            record.icon = val ? '' : 'icon-';
            form.setFieldsValue({
                [`pathName_table_${record.id}`]: '',
                [`pathUrl_table_${record.id}`]: record.pathUrl || '',
                [`icon_table_${record.id}`]: record.icon || ''
            });
        }
        setChildAuthFunc(index,1, record);
    }

    const handleSaveAuthResource = async (index: number, record: any, state?: string) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                // TODO: 保存、添加 公共参数
                const params: any = {
                    ...record, level: location.pathname.indexOf('/level2/') > -1 ? 3 : 2,
                    enableFlag: record.enableFlag ? 1 : 0, type: record.type ? 2 : 1, sort: 1,
                    parentId: record.parentId || authInfoVO.id || '',
                    parentIds: record.parentIds || ((authInfoVO.parentIds || '') + authInfoVO.id) || ''
                };
                // TODO: 添加
                if (state === 'add') {
                    params.id = '0';
                    result = await addAuthResource(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editAuthResource(params);
                }
                if (result.success) {
                    message.success('Success');
                    record.isChange = false;
                    setChildAuthFunc(index,1, record);
                } else {
                    message.error(result.message);
                }
                setLoading(false);
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
                setLoading(false);
            })
    }

    /**
     * @Description: TODO: 删除权限
     * @author XXQ
     * @date 2023/6/8
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     lock：解锁、锁定用户；delete：删除
     * @returns
     */
    const handleOperateAuthResource = async (record: any, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        // TODO: 【删除】 操作
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) {
                result.success = true;
            } else {
                result = await deleteAuthResource({id: record.id});
            }
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            setChildAuthFunc(index,1);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }
    //endregion

    const columns: ProColumns<any>[] = [
        {
            title: 'Name', dataIndex: 'name', align: 'left',
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        initialValue={record.name}
                        disabled={record.enableFlag}
                        id={`name_table_${record.id}`}
                        name={`name_table_${record.id}`}
                        rules={[{required: true, message: 'Name'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'name', val)}
                    /> : text
        },
        {
            title: 'Identity', dataIndex: 'identityCode', align: 'left', width: 120,
            tooltip: 'Identity is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        disabled={record.enableFlag}
                        initialValue={record.identityCode}
                        name={`identityCode_table_${record.id}`}
                        rules={[{required: true, message: 'Identity'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'identityCode', val)}
                    /> : text
        },
        {
            title: 'Path Name', dataIndex: 'pathName', align: 'left', width: 150,
            tooltip: 'Path Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        required={!record.type}
                        disabled={record.enableFlag}
                        initialValue={record.pathName}
                        name={`pathName_table_${record.id}`}
                        rules={[{required: !record.type, message: 'Path Name'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'pathName', val)}
                    /> : text
        },
        {
            title: 'Url', dataIndex: 'pathUrl', align: 'left', width: 200,
            tooltip: 'Url is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        required={!record.type}
                        disabled={record.enableFlag}
                        initialValue={record.pathUrl}
                        name={`pathUrl_table_${record.id}`}
                        rules={[{required: !record.type, message: 'Url'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'pathUrl', val)}
                    /> : text
        },
        {
            title: 'Icon', dataIndex: 'icon', align: 'left', width: 200,
            tooltip: 'Icon is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        required={!record.type}
                        initialValue={record.icon}
                        disabled={record.enableFlag}
                        name={`icon_table_${record.id}`}
                        rules={[{required: !record.type, message: 'Icon'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'icon', val)}
                    /> : text
        },
        {
            title: 'Hidden Menu', dataIndex: 'hideInMenu', align: 'center', width: 110,
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemSwitch
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                        disabled={record.enableFlag}
                        initialValue={!!record.hideInMenu}
                        name={`hideInMenu_table_${record.id}`}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'hideInMenu', val)}
                    /> : text
        },
        {
            title: 'Operate Auth', dataIndex: 'type', align: 'center', width: 110,
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemSwitch
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                        initialValue={record.type}
                        disabled={record.enableFlag}
                        name={`type_table_${record.id}`}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'type', val)}
                    /> : text
        },
        {
            title: 'Redirect', dataIndex: 'redirect', align: 'left', width: 80,
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        disabled={record.enableFlag}
                        initialValue={record.redirect}
                        name={`redirect_table_${record.id}`}
                        // rules={[{required: true, message: 'redirect'}]}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'redirect', val)}
                    /> : text
        },
        {
            title: 'Redirect Path', dataIndex: 'redirectPath', align: 'left', width: 120,
            render: (text: any, record: any, index) =>
                record.parentId === authInfoVO.id || !record.parentId ?
                    <FormItemInput
                        disabled={record.enableFlag}
                        initialValue={record.redirectPath}
                        name={`redirectPath_table_${record.id}`}
                        onChange={(val: any) => handleChangeAuthResource(index, record, 'redirectPath', val)}
                    /> : text
        },
        {
            title: 'Action', width: 100, align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                const haveChildren = !!record?.children?.length;
                return (
                    <Fragment>
                        {/* 保存 */}
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveAuthResource(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <DividerCustomize hidden={!record.isChange}/>
                        {/* 查看 */}
                        <IconFont hidden={isAdd} type={'icon-details'} onClick={() => handleViewChildAuth(record)}/>
                        {/* 删除 */}
                        <Popconfirm
                            disabled={haveChildren}
                            okText={'Yes'} cancelText={'No'}
                            title={`Are you sure to delete?`}
                            onConfirm={() => handleOperateAuthResource(record, index, 'deleteFlag')}
                        >
                            <DividerCustomize hidden={isAdd}/>
                            <DeleteOutlined
                                color={haveChildren ? '#707070' : 'red'} disabled={haveChildren}
                                title={haveChildren ? 'Please delete the child permissions first.' : ''}
                            />
                        </Popconfirm>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <PageContainer header={{breadcrumb: {}}}>
            <Spin spinning={loading}>
                <ProForm
                    form={form}
                    formRef={formRef}
                    layout={'vertical'}
                    // TODO: 不显示提交、重置按键
                    submitter={false}
                    // TODO: 焦点给到第一个控件
                    autoFocusFirstInput
                    formKey={'authority-information'}
                    // TODO: 提交数据
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    params={{id: authId}}
                    // TODO: 向后台请求数据
                    request={async (params) => handleQueryAuthResourceTree(params)}
                >
                    <ProCard title={'Name & Code'} className={'ant-card ant-card-pro-table'}>
                        {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                        <Row gutter={24}>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    tooltip='length: 64'
                                    required placeholder=''
                                    name='name' label='Name'
                                    rules={[{required: true, message: 'Name'}, {max: 64, message: 'length: 64'}]}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    tooltip='length: 64'
                                    required placeholder=''
                                    name='pathName' label='Path Name'
                                    rules={[{required: true, message: 'pathName'}, {max: 64, message: 'length: 64'}]}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    tooltip='length: 128'
                                    required placeholder=''
                                    name='pathUrl' label='Path'
                                    rules={[{required: true, message: 'Path'}, {max: 128, message: 'length: 128'}]}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    tooltip='length: 255'
                                    required placeholder=''
                                    name='icon' label='Icon'
                                    rules={[{required: true, message: 'Icon'}, {max: 255, message: 'length: 255'}]}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    tooltip='length: 255'
                                    required placeholder=''
                                    name='identityCode' label='Identity'
                                    rules={[{required: true, message: 'Identity'}, {max: 255, message: 'length: 255'}]}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    name='redirect' label='Redirect'
                                    tooltip='length: 255' placeholder=''
                                    rules={[{max: 255, message: 'length: 255'}]}
                                    fieldProps={{
                                        onChange: (e: any)=> setRedirectVal(e?.target?.value || '')
                                    }}
                                />
                            </Col>
                            <Col span={4} xs={24} sm={12} md={12} lg={12} xl={6} xxl={6}>
                                <ProFormText
                                    required={!!redirectVal}
                                    tooltip='length: 255' placeholder=''
                                    name='redirectPath' label='Redirect Path'
                                    rules={[
                                        {max: 255, message: 'length: 255'},
                                        {required: !!redirectVal, message: 'Identity'}
                                    ]}
                                />
                            </Col>
                            <Col span={4} xs={12} sm={6} md={6} lg={6} xl={3} xxl={3}>
                                <ProFormSwitch
                                    name='hideInMenu' label='Hidden Menu'
                                    fieldProps={{checkedChildren: 'Yes', unCheckedChildren: 'No',}}
                                />
                            </Col>
                            <Col span={4} xs={12} sm={6} md={6} lg={6} xl={3} xxl={3}>
                                <ProFormSwitch
                                    name='type' label='操作权限'
                                    fieldProps={{checkedChildren: 'Yes', unCheckedChildren: 'No',}}
                                />
                            </Col>
                        </Row>
                    </ProCard>

                    {/* 二级菜单时不显示子集 */}
                    <ProCard title={'Authority'} className={'ant-card ant-card-pro-table'}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <ProTable<any>
                                    rowKey={'id'}
                                    search={false}
                                    options={false}
                                    bordered={true}
                                    loading={loading}
                                    columns={columns}
                                    dataSource={authChildListVO || []}
                                    locale={{emptyText: 'No Data'}}
                                    className={'ant-pro-table-edit'}
                                    rowClassName={(record: any) => record?.enableFlag ? 'ant-table-row-disabled' : ''}
                                    headerTitle={
                                        <Search
                                            placeholder='' enterButton="Search" loading={loading}
                                            onSearch={async () => await handleQueryAuthResourceTree({id})}
                                        />
                                    }
                                    toolbar={{
                                        actions: [
                                            <Button key={'add'} onClick={handleAddAuth} type={'primary'} icon={<PlusOutlined/>}>
                                                Add AuthResource
                                            </Button>
                                        ]
                                    }}
                                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                                />
                            </Col>
                        </Row>
                    </ProCard>
                    <FooterToolbar extra={
                        <Button onClick={() => handleViewChildAuth(authInfoVO, true)}>
                            Back
                        </Button>
                    }>
                        <Space>
                            <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                        </Space>
                    </FooterToolbar>
                </ProForm>
            </Spin>
        </PageContainer>
    )
}
export default AuthResourceForm;