import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button, Space} from 'antd'
import {history} from '@@/core/history'

const BPMNList: React.FC<RouteChildrenProps> = () => {
    /* WorkFlow */
    // const config = data.data.nodeConfig;

    // const bpmnFilePath = 'path/to/bpmn-file.bpmn';

    return (
        <PageContainer
            className={'ant-pro-container-bpmn'}
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>
            </ProCard>
            <FooterToolbar
                extra={<Button onClick={() => history.push({pathname: '/manager/bpmn/list'})}>返回</Button>}>
                <Space>
                    <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                </Space>
            </FooterToolbar>
        </PageContainer>
    )
}
export default BPMNList;