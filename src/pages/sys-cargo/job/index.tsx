import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button, Space} from 'antd'
import {history} from 'umi'

const Ticket: React.FC<RouteChildrenProps> = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(!loading), 1500)
        }
    }, [loading]);

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>
                <Space>
                    <ProCard>个人中心</ProCard>
                </Space>
            </ProCard>
            <FooterToolbar extra={<Button onClick={()=> history.goBack()}>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default Ticket;