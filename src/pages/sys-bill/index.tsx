import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button} from 'antd'


const Bill: React.FC<RouteChildrenProps> = () => {

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>欢迎使用 Smart HK BILL </ProCard>
            <FooterToolbar extra={<Button>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default Bill;