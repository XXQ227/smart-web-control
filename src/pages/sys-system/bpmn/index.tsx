import React from 'react';
import type { RouteChildrenProps } from 'react-router';
import {PageContainer, ProCard} from '@ant-design/pro-components'
import './style.less'
import {xmlStr} from '@/pages/sys-system/bpmn/resources/xmlStr'
import BpmnJsModeler from '@/pages/sys-system/bpmn/bpmn-js/bpmn-js-modeler'
// import BpmnJsModeler from '@/pages/sys-system/bpmn/bpmn-js/bpmn-js-read-file'


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
        </PageContainer>
    )
}

export default BpmnJsFetch;
