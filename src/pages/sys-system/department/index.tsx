import React, {Fragment, useEffect, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable,} from '@ant-design/pro-components'
import {Button, Divider, Input, message, Popconfirm} from 'antd'
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import ls from 'lodash'
import {IconFont} from '@/utils/units'
import type {RouteChildrenProps} from 'react-router'
import {history, useModel} from 'umi'

const Search = Input.Search;

type APIDeptSearch = APISystem.SearchDeptParams;
type APIDepartment = APISystem.Department;

// TODO: 获取单票集的请求参数
const searchParams: APIDeptSearch = {
    name: '',
};


const DepartmentIndex: React.FC<RouteChildrenProps> = (props) => {
    //region TODO: 数据层
    const {
        queryDepartment, operateDepartment, deleteDepartment
    } = useModel('system.department', (res: any) => ({
        queryDepartment: res.queryDepartment,
        operateDepartment: res.operateDepartment,
        deleteDepartment: res.deleteDepartment,
    }));
    const [loading, setLoading] = useState<boolean>(false);
    const [DepartmentListVO, setDepartmentListVO] = useState<APIDepartment[]>([]);
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
        const result: APISystem.DepartmentResult = await queryDepartment(params);
        setDepartmentListVO(result.data);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO: 添加部门
     * @author XXQ
     * @date 2023/5/24
     * @param record    部门信息
     * @returns
     */
    const handleEditDept = (record?: APIDepartment) => {
        history.push({pathname: `/manager/department/form/${btoa(record?.id || '0')}`})
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
        if (filedName === 'deleteFlag') {
            newData.splice(index, 1);
        } else {
            const target: any = newData?.find((item: APIDepartment) => item.id === rowKey) || {};
            target[filedName] = val?.target?.value || val;
            newData.splice(index, 1, target);
        }
        setDepartmentListVO(newData);
    }

    /**
     * @Description: TODO: 冻结部门
     * @author XXQ
     * @date 2023/5/15
     * @param record    编辑行数据
     * @param index     编辑行序列
     * @param state     操作状态
     * @returns
     */
    const handleOperateDept = async (record: any, index: number, state: string) => {
        setLoading(true);
        const params: any = {id: record.id};
        let result: API.Result;
        if (state === 'deleteFlag') {
            result = await deleteDepartment(params);
        } else {
            result = await operateDepartment(params);
        }
        if (result.success) {
            message.success('Success!');
            // TODO: 冻结成功后，当能行不能编辑，或者解冻成功后，当前行可编辑
            handleDeptChange(index, record.id, state, !record[state]);
            setLoading(false);
        } else {
            message.error(result.message);
            setLoading(false);
        }
    }

    // TODO: 表单列
    const columns: ProColumns<APIDepartment>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            disable: true,
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 240,
            disable: true,
            align: 'center',
        },
        {
            title: 'Leader',
            dataIndex: 'charge_person',
            width: 150,
            disable: true,
            align: 'center',
        },
        {
            title: 'Phone',
            dataIndex: 'contact_phone',
            width: 150,
            disable: true,
            align: 'center',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            width: 80,
            disable: true,
            align: 'left',
        },
        {
            title: 'Action',
            width: 100,
            disable: true,
            align: 'center',
            // render: (text, record, index) => {
            render: (text, record, index) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={()=> handleEditDept(record)} />
                        <Popconfirm
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleOperateDept(record, index, 'enableFlag')}
                            title={`Are you sure to ${record.enableFlag ? 'unlock' : 'lock'}?`}
                        >
                            <Divider type='vertical'/>
                            <IconFont type={record.enableFlag ? 'icon-lock-2' : 'icon-unlock-2'}/>
                        </Popconfirm>
                        <Popconfirm
                            onConfirm={() => handleOperateDept(record, index, 'deleteFlag')}
                            title={'Sure to delete?'} okText={'Yes'} cancelText={'No'}
                        >
                            <Divider type='vertical'/>
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
                <ProTable<APIDepartment>
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
                                searchParams.name = val;
                                await handleGetDepartmentList(searchParams);
                            }}/>
                    }
                    toolbar={{
                        actions: [
                            <Button key={'add'} onClick={()=> handleEditDept({id: '0'})} type={'primary'} icon={<PlusOutlined/>}>
                                Add Department
                            </Button>
                        ]
                    }}
                />
            </ProCard>
        </PageContainer>
    )
}
export default DepartmentIndex;