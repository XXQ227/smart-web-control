import React, {useEffect, useRef, useState} from 'react';
import {FooterToolbar} from '@ant-design/pro-components'
import {Button, Space} from 'antd'
import {history} from '@@/core/history'
// @ts-ignore
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// 自定义的 properties-panel 内容
import propertiesProviderModule from '../components/properties-panel-extension/provider/authority';
// @ts-ignore
import authorityModdleDescriptor from '../components/properties-panel-extension/descriptors/authority';


// TODO: 以下为bpmn工作流绘图工具的样式
// 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式
import '../styles/bpmn-custom-color.css'
import '../styles/bpmn-properties-theme-blue.css'
// import '../styles/bpmn-properties-theme-black.css'
// import '../styles/bpmn-properties-theme-red.css'

interface Props {
    xmlStr: any;
    handleChangeBpmnXml: (xml: any) => void;
}

const BpmnJsModeler: React.FC<Props> = (props) => {
    const containerRef = useRef(null);
    const [viewerState, setViewerState] = useState<any>({});

    useEffect(() => {
        const viewer = new BpmnModeler({
            container: '#canvas',
            // 使用快捷键
            keyboard: {
                bindTo: window,
            },
            //添加右侧控制板
            propertiesPanel: {
                // parent: '#js-properties-panel'
            },
            additionalModules: [
                // 左边的工具栏(固定引入)
                propertiesPanelModule,
                // 自定义右边工作栏的内容
                propertiesProviderModule
            ],
            moddleExtensions: {
                authority: authorityModdleDescriptor
            }
        });
        viewer.importXML(props.xmlStr, (err: any) => {
            if (err) {
                console.log('something went wrong:', err);
            } else {
                // 给图绑定事件，当图有发生改变就会触发这个事件
                // viewer.on('commandStack.changed', () => {
                //     // 把传入的 done 再传给bpmn原型的saveXML函数调用
                //     viewer.saveXML({ format: true }, (_err: any, xml: any) => {
                //         props.handleChangeBpmnXml(xml);
                //     })
                // })
                handleAddModelerListener(viewer);
                handleAddEventBusListener(viewer);
                // 让图能自适应屏幕
                viewer.get('canvas').zoom('fit-viewport', 'auto');
            }
        });
        if (viewer) setViewerState(viewer);
    }, [props, props.xmlStr]);

    /**
     * @Description: TODO: BPMN 监听：有 【移动、添加、删除】3个监听事件
     * @author XXQ
     * @date 2023/7/11
     * @param viewer
     * @returns
     */
    function handleAddModelerListener(viewer: any) {
        // 'shape.removed', 'connect.end', 'connect.move'
        const events = ['shape.added', 'shape.move.end', 'shape.removed']
        events.forEach((event) => {
            viewer.on(event, (e: any) => {
                // const elementRegistry = viewer.get('elementRegistry')
                // const shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
                if (event === 'shape.added') {
                    console.log('新增了shape')
                } else if (event === 'shape.move.end') {
                    console.log('移动了shape')
                } else if (event === 'shape.removed') {
                    console.log('删除了shape')
                }
            })
        })
    }

    /**
     * @Description: TODO: change or click
     * @author XXQ
     * @date 2023/7/11
     * @param viewer
     * @returns
     */
    function handleAddEventBusListener(viewer: any) {
        // 监听 element
        const eventBus = viewer.get('eventBus');
        const modeling = viewer.get('modeling');
        const elementRegistry = viewer.get('elementRegistry');
        const eventTypes = ['element.click', 'element.changed'];
        eventTypes.forEach((eventType) => {
            eventBus.on(eventType, (e: any) => {
                if (!e || e.element.type == 'bpmn:Process') return;
                if (eventType === 'element.changed') {
                    handleElementChanged(viewer, e);
                } else if (eventType === 'element.click') {
                    const shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
                    if (shape.type === 'bpmn:StartEvent') {
                        modeling.updateProperties(shape, {
                            name: '我是修改后的虚线节点',
                            isInterrupting: false,
                            customText: '我是自定义的text属性'
                        })
                    }
                }
            })
        })
    }

    function handleElementChanged(viewer: any, e: any) {
        const shape = viewer.get('elementRegistry')?.get(e.element.id);
        if (!shape) {
            // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
            console.log('无效的shape')
            // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
            console.log('删除了shape和connect')
            return
        }
        if (!!shape.type) {
            if (shape.type === 'bpmn:SequenceFlow') {
                console.log('改变了线')
            }
        }
    }

    // TODO: 保存为【.bpmn】格式的文件
    const handeSaveBpmnXml = () => {
        const saveDiagramBpmn = document.getElementById('saveDiagram');
        // 把传入的 done 再传给bpmn原型的saveXML函数调用
        viewerState.saveXML({format: true}, (_err: any, xml: any) => {
            // props.handleChangeBpmnXml(xml);
            handleDownloadBpmn(saveDiagramBpmn, 'diagram.bpmn', xml);
        })
    }

    // TODO: 保存为【svg】格式的流程图
    const handeSaveBpmnSvg = () => {
        const saveDiagramSvg = document.getElementById('saveSvg');
        // 把传入的 done 再传给bpmn原型的saveXML函数调用
        viewerState.saveSVG((_err: any, xml: any) => {
            // props.handleChangeBpmnXml(xml);
            handleDownloadBpmn(saveDiagramSvg, 'diagram.svg', xml);
        })
    }

    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    function handleDownloadBpmn(link: any, name: any, data: any) {
        // 把xml转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data)
        // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
        // const xmlFile = new File([data], 'test.bpmn');
        // console.log(xmlFile);
        if (data) {
            // link.className = 'ant-btn ant-btn-primary'
            link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
            link.download = name
        }
    }

    return (
        <div className={'containers'} style={{height: '100%'}}>
            <div id={'canvas'} ref={containerRef}/>
            <div id="js-properties-panel" className="panel"/>
            <FooterToolbar
                extra={<Button onClick={() => history.push({pathname: '/manager/bpmn/list'})}>返回</Button>}>
                <Space>
                    <Button type={'primary'} id={'saveDiagram'} href={'javascript:'} onClick={() => handeSaveBpmnXml()}>
                        Save BPMN XML
                    </Button>
                    <Button type={'primary'} id={'saveSvg'} href={'javascript:'} onClick={() => handeSaveBpmnSvg()}>
                        Save BPMN SVG
                    </Button>
                </Space>
            </FooterToolbar>
        </div>
    )
}
export default BpmnJsModeler;