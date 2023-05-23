import React, {Fragment, useEffect, useRef, useState} from 'react';
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
import {Button, Col, Divider, Form, Row, Space} from 'antd'
import {useModel, history} from 'umi'
import PortDrawerForm from '@/pages/sys-manager/port/port-drawer-form'
import {DeleteOutlined} from '@ant-design/icons'

type APIDepartment = APIManager.Department;

interface Props {
    DepartmentList: APIDepartment[],
}

const DepartmentForm: React.FC<Props> = (props) => {
    // @ts-ignore
    const {DepartmentList} = props;
    //region TODO: 数据层

    const [DepartmentListVO, setDepartmentListVO] = useState<APIDepartment[]>(DepartmentList || []);


    //endregion

    useEffect(() => {
    }, [])

    //region TODO:
    //endregion

    const columns: ProColumns<APIDepartment>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            disable: true,
            align: 'center',
        },
        {
            title: 'Leader',
            dataIndex: 'charge_person',
            width: 100,
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
            width: 150,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <Divider type='vertical'/>
                        <DeleteOutlined color={'red'}/>
                    </Fragment>
                )
            },
        },
    ];

    return (
        <ProTable<APIDepartment>
            rowKey={'ID'}
            search={false}
            options={false}
            bordered={true}
            pagination={false}
            columns={columns}
            dataSource={DepartmentList}
            className={'ant-pro-table-edit'}
        />
    )
}
export default DepartmentForm;