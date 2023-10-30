import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components'
import {useModel, useParams} from 'umi';
import {Button, Form, Input, message, Popconfirm} from 'antd'
import {DeleteOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {getFormErrorMsg, IconFont, ID_STRING} from '@/utils/units'
import DividerCustomize from '@/components/Divider'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSwitch from '@/components/FormItemComponents/FormItemSwitch'

const {Search} = Input;


interface Props {
    AuthList: any[];
    AuthInvoVO: any;
    handleViewChildAuth: (record: any) => void;
    handleQueryAuthResourceTree: (params: any) => void;
    handleChangeChildAuth: (authList: any[]) => void;
}

const AuthListIndex: React.FC<Props> = (props) => {
    const urlParams = useParams();
    // @ts-ignore
    const id = atob(urlParams.id);
    const [form] = Form.useForm();
    // TODO: 判断是否是二级菜单
    const isLevel2 = location.pathname.indexOf('/level2/') > -1;

    const {AuthList, AuthInvoVO} = props;

    const {
        deleteAuthResource, addAuthResource, editAuthResource,
    } = useModel('system.auth', (res: any) => ({
        queryAuthResourceTree: res.queryAuthResourceTree,
        addAuthResource: res.addAuthResource,
        editAuthResource: res.editAuthResource,
    }));

    const [loading, setLoading] = useState<boolean>(false);


    // TODO: 添加权限
    const handleAddAuth = () => {
        const addDataObj: any = {
            id: ID_STRING(), isChange: true,
            name: '', url: '', pathName: '', pathUrl: AuthInvoVO.pathUrl + '/',
            icon: 'icon-', identityCode: '', type: false,
            // TODO: parentId：上一层的 id；parentIds：上一层的 parentIds + 上一层自己的 id
            parentId: AuthInvoVO.id || '', parentIds: (AuthInvoVO.parentIds || '') + AuthInvoVO.id
        };
        const newData: any[] = ls.cloneDeep(AuthList);
        newData.splice(0, 0, addDataObj);
        props.handleChangeChildAuth(newData);
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
        const newData: any[] = ls.cloneDeep(AuthList);
        record[filedName] = val?.target?.value || val;
        record.isChange = true;
        if (filedName === 'type') {
            record.pathName = '';
            record.pathUrl = val ? '' : AuthInvoVO.pathUrl + '/';
            record.icon = val ? '' : 'icon-';
            form.setFieldsValue({
                [`pathName_table_${record.id}`]: '',
                [`pathUrl_table_${record.id}`]: record.pathUrl || '',
                [`icon_table_${record.id}`]: record.icon || ''
            });
        }
        newData.splice(index, 1, record);
        props.handleChangeChildAuth(newData);
    }

    const handleSaveAuthResource = async (index: number, record: any, state?: string) => {
        setLoading(true);
        form.validateFields()
            .then(async () => {
                let result: API.Result;
                const newData: any[] = ls.cloneDeep(AuthList);
                // TODO: 保存、添加 公共参数
                const params: any = {
                    ...record, level: isLevel2 ? 3 : 2, type: record.type ? 2 : 1, sort: 1,
                    parentId: record.parentId || AuthInvoVO.id || '',
                    parentIds: record.parentIds || ((AuthInvoVO.parentIds || '') + AuthInvoVO.id) || ''
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
                    newData.splice(index, 1, record);
                    props.handleChangeChildAuth(newData);
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
        const newData: any[] = ls.cloneDeep(AuthList);
        // TODO: 【删除】 操作
        if (state === 'deleteFlag') {
            if (record.id.indexOf('ID_') > -1) {
                result.success = true;
            } else {
                result = await deleteAuthResource({id: record.id});
            }
            // TODO: 删除当前行，更新本地数据
            newData.splice(index, 1);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            setLoading(false);
            props.handleChangeChildAuth(newData);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    const handleViewChildAuth = async (record: any) => {
        props.handleViewChildAuth(record);
    }

    const columns: ProColumns<any>[] = [
        {
            title: 'Name', dataIndex: 'name', align: 'left',
            tooltip: 'Name is required', className: 'ant-columns-required',
            render: (text: any, record: any, index) =>
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        required
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        placeholder=''
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
                record.parentId === AuthInvoVO.id || !record.parentId ?
                    <FormItemInput
                        placeholder=''
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
        <Fragment>
            <Form form={form} name={'auth-list'}>
                <ProTable<any>
                    rowKey={'id'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    dataSource={AuthList || []}
                    locale={{emptyText: 'No Data'}}
                    className={'ant-pro-table-edit'}
                    rowClassName={(record) => record.enableFlag ? 'ant-table-row-disabled' : ''}
                    headerTitle={
                        <Search
                            placeholder='' enterButton="Search" loading={loading}
                            onSearch={async () => await props.handleQueryAuthResourceTree({id})}
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
            </Form>
            {/*<ModalLevel2Auth*/}
            {/*    open={open}*/}
            {/*/>*/}
            {/* // TODO: 用于保存时，获取数据用 */}
            {/*<ProFormText hidden={true} name={'billOfLoadingEntity'}/>*/}
        </Fragment>
    )
}
export default AuthListIndex;