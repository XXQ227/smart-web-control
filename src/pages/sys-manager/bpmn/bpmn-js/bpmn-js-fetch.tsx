import React, {useEffect, useRef} from 'react';
import BpmnJS from 'bpmn-js'


interface Props {
    xmlStr: any;
}

const BpmnJsFetch: React.FC<Props> = (props) => {
    const containerRef = useRef(null);

    function fetchDiagram(url: any) {
        return fetch(url).then(response => response.text());
    }

    useEffect(() => {
        setTimeout(async ()=> {
            const viewer: any = new BpmnJS({container: containerRef.current});
            try {
                const diagram = await fetchDiagram('../resources/bpmn-file.bpmn');
                console.log(diagram);
                const { warnings } = await viewer.importXML(diagram);
                viewer.get('canvas').zoom('fit-viewport');
                console.log('rendered: warnings ==> ', warnings);
            } catch (err) {
                console.log('error rendering', err);
            }
        }, 300);
        return () => {
        };
    }, [props.xmlStr]);

    return (
        <div style={{height: '100%'}}>
            <div id={'canvas'} ref={containerRef} />
        </div>
    )
}
export default BpmnJsFetch;