import React, {Fragment, useEffect, useRef, useState} from 'react';
import type {ProColumns, ProFormInstance} from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProFormSelect,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components'
import {Button, Divider, Input, message, Popconfirm, Form} from 'antd'
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {CustomizeIcon, getFormErrorMsg, ID_STRING} from '@/utils/units'
import {getUserID} from '@/utils/auths'
import type {RouteChildrenProps} from 'react-router'
import {useModel} from 'umi'

const Search = Input.Search;

type APIDeptSearch = APIManager.SearchDeptParams;
type APIDepartment = APIManager.Department;

// TODO: 获取单票集的请求参数
const searchParams: APIDeptSearch = {
    Name: '',
    UserID: getUserID()
};

const levelList = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
];

const DepartmentIndex: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const [form] = Form.useForm();
    const ref = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        DepartmentList, getDepartmentList, freezenDepartment, saveDepartment
    } = useModel('manager.department', (res: any) => ({
        DepartmentList: res.DepartmentList,
        getDepartmentList: res.getDepartmentList,
        saveDepartment: res.saveDepartment,
        freezenDepartment: res.freezenDepartment,
    }));
    const [loading, setLoading] = useState<boolean>(false);
    const [DepartmentListVO, setDepartmentListVO] = useState<APIDepartment[]>(DepartmentList || []);
    //endregion

    useEffect(() => {
    }, [])

    //region TODO:
    //endregion

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetDepartmentList(params: APIDeptSearch) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        // params.PageNum = params.current || 1;
        // params.pageSize = params.PageSize || 15;
        // params.PageSize = params.PageSize || 15;
        // const result: APIManager.DepartmentResult = await getDepartmentList(params);
        // setDepartmentListVO(result.data);
        setDepartmentListVO([]);
        setLoading(false);
        return [];
    }

    /**
     * @Description: TODO: 添加部门
     * @author XXQ
     * @date 2023/5/24
     * @returns
     */
    const handleAddDept = () => {
        const newData: APIDepartment[] = ls.cloneDeep(DepartmentListVO);
        const deptObj: APIDepartment = {
            id: ID_STRING(),
            name: '',
            parent_id: null,
            level: 1,
            sort: null,
            email: '',
            charge_person: '',
            contact_phone: '',
            parent_ids: '',
            delete_flag: false,
            isChange: true,
            enable_flag: 1,
            create_user_id: getUserID(),
            update_user_id: getUserID()
        }
        newData.push(deptObj);
        setDepartmentListVO(newData);
    }

    /**
     * @Description: TODO: 删除信息
     * @author XXQ
     * @date 2023/5/24
     * @param record    部门信息
     * @returns
     */
    const handleDelDept = (record: APIDepartment) => {
        const newData: APIDepartment[] = DepartmentListVO.filter((item: APIDepartment) => item.id !== record.id);
        setDepartmentListVO(newData);
    }

    /**
     * @Description: TODO: 修改部门数据
     * @author XXQ
     * @date 2023/5/24
     * @param index     当前行序号
     * @param rowKey    当前行 id
     * @param filedName 编辑字段
     * @param val       编辑值
     * @returns
     */
    const handleDeptChange = (index: number, rowKey: any, filedName: string, val: any) => {
        const newData: APIDepartment[] = ls.cloneDeep(DepartmentListVO);
        const target: any = newData?.find((item: APIDepartment) => item.id === rowKey) || {};
        target[filedName] = val?.target?.value || val;
        target.isChange = true;
        newData.splice(index, 1, target);
        setDepartmentListVO(newData);
    }

    /**
     * @Description: TODO: 冻结部门
     * @author XXQ
     * @date 2023/5/15
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @returns
     */
    const handleFreezenDept = async (record: any, index: number, ) => {
        setLoading(true);
        const params = {
            UserID: getUserID(),
            id: record.id,
            enable_flag: record.enable_flag,
        }
        const result: any = await freezenDepartment(params);
        if (result.Result) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            handleDeptChange(index, record.id, 'enable_flag', !record.enable_flag);
            setLoading(false);
        } else {
            message.error(result.Content);
            setLoading(false);
        }
    }

    const onValuesChange = () => {
        form.validateFields()
            .then((val)=> {
                console.log(val);
            })
            .catch((err: any) => {
                console.log(err);
            })
    }

    /**
     * @Description: TODO: 保存部门信息
     * @author XXQ
     * @date 2023/5/25
     * @param record    编辑行
     * @param index
     * @returns
     */
    const handleSave = async (record: APIDepartment, index: number) => {
        form.validateFields()
            .then((val)=> {
                console.log(val, record);
                record.id = typeof record.id === 'string' ? 0 : record.id;
                // const target: any = {};
                // Object.keys(record).map((item: any) => {
                //     const key = item.substring(0, item.indexOf(record.id) || item.length);
                //     target[key] = record[item];
                // });
                console.log(record);
            })
            .catch((err: any) => {
                message.error(getFormErrorMsg(err));
            })
    }

    // TODO: 表单列
    const columns: ProColumns<APIDepartment>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            disable: true,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    id={`name${record.id}`}
                    name={`name${record.id}`}
                    initialValue={record.name}
                    rules={[{required: true, message: 'Department Name'}]}
                    fieldProps={{
                        onBlur: (val: any) => handleDeptChange(index, record.id, 'name', val)
                    }}
                />
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 240,
            disable: true,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    id={`email${record.id}`}
                    name={`email${record.id}`}
                    initialValue={record.email}
                    rules={[
                        {required: true, message: 'Email'},
                        {
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'The email format is incorrect.'
                        }
                    ]}
                    fieldProps={{
                        onBlur: (val: any) => handleDeptChange(index, record.id, 'email', val)
                    }}
                />
        },
        {
            title: 'Leader',
            dataIndex: 'charge_person',
            width: 150,
            disable: true,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    id={`charge_person${record.id}`}
                    name={`charge_person${record.id}`}
                    initialValue={record.charge_person}
                    rules={[{required: true, message: 'Leader'}]}
                    fieldProps={{
                        onBlur: (val: any) => handleDeptChange(index, record.id, 'charge_person', val)
                    }}
                />
        },
        {
            title: 'Phone',
            dataIndex: 'contact_phone',
            width: 150,
            disable: true,
            align: 'center',
            render: (text: any, record: any, index) =>
                <ProFormText
                    required
                    placeholder=''
                    id={`contact_phone${record.id}`}
                    name={`contact_phone${record.id}`}
                    initialValue={record.contact_phone}
                    rules={[{required: true, message: 'Phone'}]}
                    fieldProps={{
                        onBlur: (val: any) => handleDeptChange(index, record.id, 'contact_phone', val)
                    }}
                />
        },
        {
            title: 'Level',
            dataIndex: 'level',
            width: 80,
            disable: true,
            align: 'left',
            render: (text: any, record: any, index) =>
                <ProFormSelect
                    required
                    placeholder=''
                    id={`level${record.id}`}
                    name={`level${record.id}`}
                    initialValue={record.level}
                    rules={[{required: true, message: 'level'}]}
                    options={levelList}
                    fieldProps={{
                        onBlur: (val: any) => handleDeptChange(index, record.id, 'level', val)
                    }}
                />
        },
        {
            title: 'Action',
            width: 100,
            disable: true,
            align: 'center',
            // render: (text, record, index) => {
            render: (text, record, index, action) => {
                return (
                    <Fragment>
                        <CustomizeIcon
                            type={'icon-save'} hidden={!record.isChange}
                            onClick={() => handleSave(record, index)}
                        />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleFreezenDept(record, index)}
                            title={`Are you sure to ${record.enable_flag ? 'unlock' : 'lock'}?`}
                        >
                            {typeof record.id === 'number' ? <Divider type='vertical'/> : null}
                            <CustomizeIcon
                                hidden={typeof record.id !== 'number'}
                                type={record.enable_flag ? 'icon-unlock-2' : 'icon-lock-2'}
                            />
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleDelDept(record)}
                            title={'Sure to delete?'} okText={'Yes'} cancelText={'No'}
                        >
                            {record.isChange ? <Divider type='vertical'/> : null}
                            <DeleteOutlined color={'red'}/>
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
            <ProCard className={'ant-card-pro-table'}>
                <Form
                    form={form}
                    onValuesChange={onValuesChange}
                >
                    <ProTable<APIDepartment>
                        // form={form}
                        // formRef={ref}
                        rowKey={'id'}
                        search={false}
                        options={false}
                        bordered={true}
                        columns={columns}
                        pagination={false}
                        params={searchParams}
                        dataSource={DepartmentListVO}
                        locale={{emptyText: 'Mo data'}}
                        className={'ant-pro-table-edit'}
                        // @ts-ignore
                        request={(params: APIDeptSearch) => handleGetDepartmentList(params)}
                        headerTitle={
                            <Search
                                placeholder='' enterButton="Search" loading={loading}
                                onSearch={async (val: any) => {
                                    // searchParams.Year = val;
                                    // await handleGetAccountList(searchParams);
                                }}/>
                        }
                        toolbar={{
                            actions: [
                                <Button key={'add'} onClick={handleAddDept} type={'primary'} icon={<PlusOutlined/>}>
                                    Add Department
                                </Button>
                            ]
                        }}
                    />
                </Form>
            </ProCard>
        </PageContainer>
    )
}
export default DepartmentIndex;