import React, {Fragment, useState} from 'react';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import {Divider, Popconfirm, Input, Button} from 'antd'
import {getUserID} from '@/utils/auths'
import {history} from '@@/core/history'

const {Search} = Input;

type APIBranch = APIManager.Branch;
type APISearchBranch = APIManager.SearchBranchParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchBranch = {
    Name: '',
    UserID: getUserID()
};

interface Props {
    BankList: any[],
}

const BankIndex: React.FC<Props> = (props) => {
    const { BankList } = props;
    const {
        // BankList
    } = useModel('manager.branch', (res: any) => ({
        // BankList: res.BankList,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [BankListVO, setBankListVO] = useState<any[]>(BankList || []);

    /**
     * @Description: TODO: 编辑 CV 信息
     * @author XXQ
     * @date 2023/5/5
     * @param record    操作当前 行
     * @param state     操作状态
     * @returns
     */
    const handleOperateBranch = async (record: any, state: string = 'form') => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/branch/${state}/${btoa(record?.ID || 0)}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }


    const columns: ProColumns<APIBranch>[] = [
        {
            title: 'Name',
            dataIndex: 'name_full_en',
            align: 'left',
        },
        {
            title: 'Short Name',
            dataIndex: 'name_short_en',
            width: 200,
            align: 'center',
        },
        {
            title: 'Currency',
            dataIndex: 'func_currency_name',
            width: 100,
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'org_id',
            width: 150,
            align: 'center',
        },
        {
            title: 'Oracle ID',
            dataIndex: 'org_id',
            width: 150,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            align: 'center',
            render: (text, record) => {
                return (
                    <Fragment>
                        <EditOutlined color={'#1765AE'} onClick={() => handleOperateBranch(record)}/>
                        <Popconfirm
                            onConfirm={() => handleOperateBranch(record, 'delete')}
                            title="Sure to delete?" okText={'Yes'} cancelText={'No'}
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
        <ProTable<APIBranch>
            rowKey={'ID'}
            search={false}
            options={false}
            bordered={true}
            loading={loading}
            columns={columns}
            params={searchParams}
            dataSource={BankListVO}
            headerTitle={'Bank Information'}
            locale={{ emptyText: 'No Data' }}
            className={'antd-pro-table-port-list'}
            toolbar={{
                actions: [
                    <Button key={'add'} onClick={handleOperateBranch} type={'primary'} icon={<PlusOutlined/>}>
                        Add Branch
                    </Button>
                ]
            }}
        />
    )
}
export default BankIndex;