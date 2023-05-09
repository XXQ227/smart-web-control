import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {history} from '@@/core/history'
import {useModel} from '@@/plugin-model/useModel'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'
import {Divider} from 'antd'

type APIPort = APIModel.Port;
type APISearchPort = APIModel.SearchPortParams;


const operationList = [
    {key: 'edit', type: 1, label: 'edit', icon: <EditOutlined/>},
    {key: 'delete', type: 2, label: 'delete', icon: <DeleteOutlined color={'red'}/>},
];


// TODO: 获取单票集的请求参数
const searchParams: APISearchPort = {
    Key: '',
    Type: null,
    PageSize: 15,
};

const PortListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        PortList, getGetPortList
    } = useModel('manager.port', (res: any) => ({
        PortList: res.PortList,
        getGetPortList: res.getGetPortList,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [PortListVO, setPortListVO] = useState<APIPort[]>(PortList || []);

    /**
     * @Description: TODO: 编辑 港口 信息
     * @author XXQ
     * @date 2023/5/9
     * @param record    操作当前 行
     * @returns
     */
    const handleOperateJob = (record: APIPort) => {
        // TODO: 伪加密处理：btoa(type:string) 给 id 做加密处理；atob(type: string)：做解密处理
        const url = `/manager/port/form/${btoa(String(record.ID))}`;
        // TODO: 跳转页面<带参数>
        // @ts-ignore
        history.push({pathname: url})
    }

    /**
     * @Description: TODO 获取单票数据集合
     * @author XXQ
     * @date 2023/2/13
     * @param params    参数
     * @returns
     */
    async function handleGetPortList(params: APISearchPort) {
        setLoading(true);
        // TODO: 分页查询【参数页】
        params.PageNum = params.current || 1;
        params.pageSize = params.PageSize || 15;
        params.PageSize = params.PageSize || 15;
        const result: APIModel.PortResult = await getGetPortList(params);
        setPortListVO(result.data);
        setLoading(false);
        return result;
    }


    const columns: ProColumns<APIPort>[] = [
        {
            title: 'Code',
            dataIndex: 'Code',
            width: 123,
            disable: true,
            align: 'center',
        },
        {
            title: 'Port',
            dataIndex: 'Name',
            disable: true,
            align: 'center',
        },
        {
            title: 'City',
            dataIndex: 'CityName',
            width: 160,
            disable: true,
        },
        {
            title: 'Country',
            dataIndex: 'CountryName',
            width: 160,
            disable: true,
            align: 'center',
        },
        {
            title: 'Country',
            dataIndex: 'CountryName',
            width: 160,
            disable: true,
            align: 'center',
        },
        {
            title: 'Type',
            dataIndex: 'TransportTypeName',
            width: 100,
            disable: true,
            align: 'center',
        },
        {
            title: 'Action',
            width: 80,
            disable: true,
            align: 'center',
            render: (text, record) => {
                return operationList?.map((x, index) =>
                    <a key={x.key} onClick={() => handleOperateJob(record)}>
                        {x.icon}
                        {index < operationList.length - 1 ? <Divider type="vertical" /> : null}
                    </a>
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
            <ProCard>
                <ProTable<APIPort>
                    rowKey={'ID'}
                    search={false}
                    options={false}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    params={searchParams}
                    dataSource={PortListVO}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchPort) => handleGetPortList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default PortListIndex;