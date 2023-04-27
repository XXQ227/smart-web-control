import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import {Button,} from 'antd'


const SettlementList: React.FC<RouteChildrenProps> = () => {



    const columns: ProColumns<APIModel.CVListInfo>[] = [
        {
            title: 'CV Type',
            dataIndex: 'Code',
            width: 80,
            disable: true,
        },
    ];


    return (
        <PageContainer
            // loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>
                <ProTable<APIModel.CVListInfo>
                    columns={columns}
                    dataSource={[]}
                />
            </ProCard>
            <FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default SettlementList;