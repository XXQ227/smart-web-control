import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button} from 'antd'


const Cargo: React.FC<RouteChildrenProps> = () => {

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>搜索栏</ProCard>
            <ProCard>搜索栏</ProCard>
            <FooterToolbar>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>打印操作</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default Cargo;