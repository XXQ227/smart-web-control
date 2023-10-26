import React, {Fragment, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {useModel} from 'umi';
import {DeleteOutlined} from '@ant-design/icons'
import {Divider} from 'antd'

type APIPort = APISystem.Port;
type APISearchPort = APISystem.SearchPortParams;


// TODO: 获取单票集的请求参数
const searchParams: APISearchPort = {
    name: '',
    pageSize: 15,
    currentPage: 1,
};

const PortListIndex: React.FC<RouteChildrenProps> = () => {

    const {
        PortList, getGetPortList
    } = useModel('system.port', (res: any) => ({
        PortList: res.PortList,
        getGetPortList: res.getGetPortList,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [PortListVO, setPortListVO] = useState<APIPort[]>(PortList || []);

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
        const result: API.Result = await getGetPortList(params);
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
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
            // extra={<PortDrawerForm PortInfo={{}} isCreate={true}/>}
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
                    className={'antd-pro-table-port-list'}
                    pagination={{showSizeChanger: true, pageSizeOptions: [15, 30, 50, 100]}}
                    // @ts-ignore
                    request={(params: APISearchPort) => handleGetPortList(params)}
                />
            </ProCard>
        </PageContainer>
    )
}
export default PortListIndex;