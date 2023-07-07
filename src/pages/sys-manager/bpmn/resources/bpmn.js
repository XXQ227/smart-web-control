export default {
  '/api/bpmn/test': {
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>Flow_0r649bn</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:serviceTask id="Activity_00q4b6b">
      <bpmn:extensionElements>
        <camunda:properties>
          <camunda:property name="aaa" value="bbb" />
        </camunda:properties>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_0r649bn</bpmn:incoming>
      <bpmn:outgoing>Flow_15ho8jm</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_0r649bn" sourceRef="StartEvent_1" targetRef="Activity_00q4b6b" />
    <bpmn:endEvent id="Event_1by4rqd">
      <bpmn:incoming>Flow_15ho8jm</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_15ho8jm" sourceRef="Activity_00q4b6b" targetRef="Event_1by4rqd" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_0r649bn_di" bpmnElement="Flow_0r649bn">
        <di:waypoint x="209" y="120" />
        <di:waypoint x="260" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_15ho8jm_di" bpmnElement="Flow_15ho8jm">
        <di:waypoint x="360" y="120" />
        <di:waypoint x="412" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_00q4b6b_di" bpmnElement="Activity_00q4b6b">
        <dc:Bounds x="260" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1by4rqd_di" bpmnElement="Event_1by4rqd">
        <dc:Bounds x="412" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
  },
};
