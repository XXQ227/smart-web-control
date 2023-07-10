import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button, Space} from 'antd'
import './style.less'
import {history} from 'umi'
import {xmlStr} from '@/pages/sys-manager/bpmn/resources/xmlStr'
import BpmnJsModeler from '@/pages/sys-manager/bpmn/bpmn-js/bpmn-js-modeler'

const BpmnJsFetch: React.FC<RouteChildrenProps> = () => {

    const handleChangeBpmnXml = (xml: any) => {
        console.log(xml);
    }

    return (
        <PageContainer
            className={'ant-pro-container-bpmn'}
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard className={'ant-card-bpmn'}>
                <BpmnJsModeler xmlStr={xmlStr} handleChangeBpmnXml={handleChangeBpmnXml}/>
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

export default BpmnJsFetch;