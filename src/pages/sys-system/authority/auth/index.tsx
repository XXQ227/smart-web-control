import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {Button, Form, Input, message, Popconfirm} from 'antd'
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {getChildrenListData, getFormErrorMsg, IconFont, ID_STRING} from '@/utils/units'
import {history} from '@@/core/history'
import DividerCustomize from '@/components/Divider'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSwitch from '@/components/FormItemComponents/FormItemSwitch'

const {Search} = Input;

type APIAuthResource = APISystem.AuthResource;
type APISearchAuthResource = APISystem.SearchAuthResourceParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchAuthResource = {
    id: 0,
};

const AuthResourceIndex: React.FC<RouteChildrenProps> = () => {
    const [form] = Form.useForm();
    const {
        queryAuthResourceTree, deleteAuthResource, addAuthResource, editAuthResource,
    } = useModel('system.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
        deleteAuthResource: res.deleteAuthResource,
        addAuthResource: res.addAuthResource,
        editAuthResource: res.editAuthResource,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [AuthResourceListVO, setAuthResourceListVO] = useState<APIAuthResource[]>([]);

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    const handleGetAuthResourceList = async (params: APISearchAuthResource) => {
        setLoading(true);
        // TODO: 分页查询【参数页】
        const result: API.Result = await queryAuthResourceTree(params);
        setLoading(false);
        if (result.success) {
            if (result.data) result.data = getChildrenListData(result.data);
            setAuthResourceListVO(result.data);
        } else {
            message.error(result.message);
        }
        return result;
    }

    const handleAddAuth = () => {
        const addDataObj: APIAuthResource = {
            id: ID_STRING(), isChange: true, name: '', url: '', icon: ''
        };
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
        newData.splice(0, 0, addDataObj);
        setAuthResourceListVO(newData);
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
    const handleChangeAuthResource = (index: number, record: APIAuthResource, filedName: string, val: any) => {
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
        // const newData: APIAuthResource[] = AuthResourceListVO.map((item: APIAuthResource) => ({...item}));
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        newData.splice(index, 1, record);
        setAuthResourceListVO(newData);
    }

    const handleSaveAuthResource = async (index: number, record: APIAuthResource, state?: string) => {
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    ...record, level: 1,
                    enableFlag: record.enableFlag ? 1 : 0, type: 1, sort: 1,
                };
                // TODO: 添加
                if (state === 'add') {
                    result = await addAuthResource(params);
                    record.id = result.data;
                } else {
                    // TODO: 编辑
                    params.id = record.id;
                    result = await editAuthResource(params);
                }
                if (result.success) {
                    if (state === 'add') record.id = result.data;
                    message.success('Success');
                    record.isChange = false;
                    newData.splice(index, 1, record);
                    setAuthResourceListVO(newData);
                } else {
                    message.error(result.message);
                }
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
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
    const handleOperateAuthResource = async (record: APIAuthResource, index: number, state: string) => {
        setLoading(true);
        let result: API.Result = {success: false};
        const params: any = {id: record.id};
        const newData: APIAuthResource[] = ls.cloneDeep(AuthResourceListVO);
        // TODO: 【删除】 操作
        if (state === 'deleteFlag') {
            result = await deleteAuthResource(params);
            // TODO: 删除当前行，更新本地数据
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            setAuthResourceListVO(newData);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    const handleDetail = (record: any) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        history.push({pathname: `/system/authority/auth/form/${btoa(record.id)}`});
    }

    const columns: ProColumns<APIAuthResource>[] = [
        {
            title: 'Name', dataIndex: 'name', align: 'left',
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    initialValue={record.name}
                    disabled={record.enableFlag}
                    id={`name_table_${record.id}`}
                    name={`name_table_${record.id}`}
                    rules={[{required: true, message: 'Name'}]}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'name', val)}
                />
        },
        {
            title: 'Identity', dataIndex: 'identityCode', align: 'left', width: 120,
            tooltip: 'Identity is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    disabled={record.enableFlag}
                    initialValue={record.identityCode}
                    name={`identityCode_table_${record.id}`}
                    rules={[{required: true, message: 'Identity'}]}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'identityCode', val)}
                />
        },
        {
            title: 'Path Name', dataIndex: 'pathName', align: 'left', width: 150,
            tooltip: 'Path Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required={!record.type}
                    disabled={record.enableFlag}
                    initialValue={record.pathName}
                    name={`pathName_table_${record.id}`}
                    rules={[{required: !record.type, message: 'Path Name'}]}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'pathName', val)}
                />
        },
        {
            title: 'Url', dataIndex: 'pathUrl', align: 'left', width: 200,
            tooltip: 'Url is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required={!record.type}
                    disabled={record.enableFlag}
                    initialValue={record.pathUrl}
                    name={`pathUrl_table_${record.id}`}
                    rules={[{required: !record.type, message: 'Url'}]}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'pathUrl', val)}
                />
        },
        {
            title: 'Icon', dataIndex: 'icon', align: 'left', width: 200,
            tooltip: 'Icon is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                <FormItemInput
                    required={!record.type}
                    initialValue={record.icon}
                    disabled={record.enableFlag}
                    name={`icon_table_${record.id}`}
                    rules={[{required: !record.type, message: 'Icon'}]}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'icon', val)}
                />
        },
        {
            title: 'Hidden Menu', dataIndex: 'hideInMenu', align: 'center', width: 110,
            render: (text: any, record: any, index) =>
                <FormItemSwitch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    disabled={record.enableFlag}
                    initialValue={!!record.hideInMenu}
                    name={`hideInMenu_table_${record.id}`}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'hideInMenu', val)}
                />
        },
        {
            title: 'Operate Auth', dataIndex: 'type', align: 'center', width: 110,
            render: (text: any, record: any, index) =>
                <FormItemSwitch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    initialValue={record.type}
                    disabled={record.enableFlag}
                    name={`type_table_${record.id}`}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'type', val)}
                />
        },
        {
            title: 'Redirect', dataIndex: 'redirect', align: 'left', width: 80,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    disabled={record.enableFlag}
                    initialValue={record.redirect}
                    name={`redirect_table_${record.id}`}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'redirect', val)}
                />
        },
        {
            title: 'Redirect Path', dataIndex: 'redirectPath', align: 'left', width: 120,
            render: (text: any, record: any, index) =>
                <FormItemInput
                    disabled={record.enableFlag}
                    initialValue={record.redirectPath}
                    name={`redirectPath_table_${record.id}`}
                    onChange={(val: any) => handleChangeAuthResource(index, record, 'redirectPath', val)}
                />
        },
        {
            title: 'Action', width: 100, align: 'center',
            render: (text, record, index) => {
                const isAdd = record?.id?.indexOf('ID_') > -1;
                const haveChildren = !!record?.children?.length;
                return (
                    <Fragment>
                        <SaveOutlined
                            color={'#1765AE'} hidden={!record.isChange}
                            onClick={() => handleSaveAuthResource(index, record, isAdd ? 'add' : 'edit')}
                        />
                        <DividerCustomize hidden={!record.isChange}/>
                        <IconFont hidden={isAdd} type={'icon-details'} onClick={() => handleDetail(record)}/>
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
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <Form form={form}>
                <ProCard className={'ant-card-pro-table'}>
                    <ProTable<APIAuthResource>
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        params={searchParams}
                        dataSource={AuthResourceListVO}
                        locale={{emptyText: 'No Data'}}
                        className={'ant-pro-table-edit'}
                        rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async () => await handleGetAuthResourceList(searchParams)}
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
                        // @ts-ignore
                        request={(params: APISearchAuthResource) => handleGetAuthResourceList(params)}
                    />
                </ProCard>
            </Form>
        </PageContainer>
    )
}
export default AuthResourceIndex;