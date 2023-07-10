import React, {useEffect, useRef} from 'react';
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
// import '../styles/bpmn-properties-theme-red.css'
import '../styles/bpmn-properties-theme-blue.css'

// import '../styles/bpmn-properties-theme-black.css'

interface Props {
    xmlStr: any;
    handleChangeBpmnXml: (xml: any) => void;
}

const BpmnJsModeler: React.FC<Props> = (props) => {
    const containerRef = useRef(null);

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
            if (!err) {
                console.log('success!');
                // 给图绑定事件，当图有发生改变就会触发这个事件
                viewer.on('commandStack.changed', () => {
                    // 把传入的 done 再传给bpmn原型的saveXML函数调用
                    viewer.saveXML({ format: true }, (_err: any, xml: any) => {
                        props.handleChangeBpmnXml(xml);
                    })
                })
                // 让图能自适应屏幕
                viewer.get('canvas').zoom('fit-viewport', 'auto');
            } else {
                console.log('something went wrong:', err);
            }
        });
    }, [props.xmlStr]);

    return (
        <div className={'containers'} style={{height: '100%'}}>
            <div id={'canvas'} ref={containerRef} />
            <div id="js-properties-panel" className="panel" />
        </div>
    )
}
export default BpmnJsModeler;