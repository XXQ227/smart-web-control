import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import './css/workflow.css';
import {Button, Space} from 'antd'
import {history} from '@@/core/history'
import BpmnViewer from '@/pages/sys-manager/bpmn/bpmn-viewer'

/* WorkFlow */
// import WorkFlow from '@/pages/sys-manager/bpmn/components/WorkFlow'
// import data from './data.json'


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
                <BpmnViewer bpmnFilePath={{}} />
                {/*<WorkFlow config={config}/>*/}
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