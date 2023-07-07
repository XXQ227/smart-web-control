export const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.activiti.org/processdef">
  <process id="ev-global" name="ev-global" isExecutable="true">
    <startEvent id="sid-f3fb94d6-eabb-4805-a999-affaab13d449"/>
    <userTask id="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0" name="创建出差申请" activiti:assignee="1"/>
    <userTask id="sid-c60bf135-d984-46f2-a85e-3b2d66b9c072" name="部门经理审核" activiti:assignee="2"/>
    <userTask id="sid-8277ba11-762d-4e54-a62f-e553d3c19ff7" name="财务审批" activiti:assignee="3}"/>
    <userTask id="sid-eecaaacc-ab48-4add-a28e-7110727d6e31" name="总经理审核" activiti:assignee="4}"/>
    <sequenceFlow id="sid-6f5d0c0a-fbd5-4c52-8778-921491e9348a" sourceRef="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0" targetRef="sid-c60bf135-d984-46f2-a85e-3b2d66b9c072"/>
    <sequenceFlow id="sid-1fee6c6a-8731-47a2-8961-d1035d02c456" sourceRef="sid-c60bf135-d984-46f2-a85e-3b2d66b9c072" targetRef="sid-8277ba11-762d-4e54-a62f-e553d3c19ff7">
      <conditionExpression></conditionExpression>
    </sequenceFlow>
    <endEvent id="sid-5c375b06-b668-49f4-9364-f9a9230d5cb2"/>
    <sequenceFlow id="sid-3c3317e0-c35f-41dd-9d9a-d951ddef9332" sourceRef="sid-8277ba11-762d-4e54-a62f-e553d3c19ff7" targetRef="sid-5c375b06-b668-49f4-9364-f9a9230d5cb2"/>
    <sequenceFlow id="sid-fed78b9f-e265-4461-9fbe-3b1f6dcc270c" sourceRef="sid-c60bf135-d984-46f2-a85e-3b2d66b9c072" targetRef="sid-eecaaacc-ab48-4add-a28e-7110727d6e31">
      <conditionExpression></conditionExpression>
    </sequenceFlow>
    <sequenceFlow id="sid-6ac4d329-c7ae-445b-91ba-d114977f3eda" sourceRef="sid-eecaaacc-ab48-4add-a28e-7110727d6e31" targetRef="sid-8277ba11-762d-4e54-a62f-e553d3c19ff7"/>
    <sequenceFlow id="sid-b96dbee9-98df-44b0-ab83-5772b4d11398" sourceRef="sid-f3fb94d6-eabb-4805-a999-affaab13d449" targetRef="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0"/>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_ev-global">
    <bpmndi:BPMNPlane bpmnElement="ev-global" id="BPMNPlane_ev-global">
      <bpmndi:BPMNShape id="shape-7aab1e9d-7a59-4c7a-9b80-a374c4fc1420" bpmnElement="sid-f3fb94d6-eabb-4805-a999-affaab13d449">
        <omgdc:Bounds x="-50.000004" y="-165.0" width="30.0" height="30.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="shape-93885be7-3106-490f-a662-4b5eeb5f9595" bpmnElement="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0">
        <omgdc:Bounds x="-85.00001" y="-100.0" width="100.0" height="80.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="shape-50ab43c5-dee9-4496-9039-fe54ecebebd7" bpmnElement="sid-c60bf135-d984-46f2-a85e-3b2d66b9c072">
        <omgdc:Bounds x="-155.0" y="30.0" width="100.0" height="80.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="shape-9439a0c3-c3ac-470b-867f-a4491d7acd92" bpmnElement="sid-8277ba11-762d-4e54-a62f-e553d3c19ff7">
        <omgdc:Bounds x="-105.0" y="180.0" width="100.0" height="80.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="shape-15c13da9-f5de-4b94-a0d1-a5624275bdf8" bpmnElement="sid-eecaaacc-ab48-4add-a28e-7110727d6e31">
        <omgdc:Bounds x="60.0" y="54.999992" width="100.0" height="80.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="edge-8c3c00b7-75b2-4ec0-98b9-1efa0d260884" bpmnElement="sid-6f5d0c0a-fbd5-4c52-8778-921491e9348a">
        <omgdi:waypoint x="-60.000008" y="-20.0"/>
        <omgdi:waypoint x="-80.0" y="30.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="edge-5c048bb1-0fe3-4418-8ceb-794a5882950b" bpmnElement="sid-1fee6c6a-8731-47a2-8961-d1035d02c456">
        <omgdi:waypoint x="-80.0" y="110.0"/>
        <omgdi:waypoint x="-80.0" y="180.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="shape-b9d9961e-83b7-4174-ae02-e7fcd80d7fef" bpmnElement="sid-5c375b06-b668-49f4-9364-f9a9230d5cb2">
        <omgdc:Bounds x="-70.0" y="350.0" width="30.0" height="30.0"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="edge-4e1b5a3a-1e62-414a-ac7d-67cdaf727c19" bpmnElement="sid-3c3317e0-c35f-41dd-9d9a-d951ddef9332">
        <omgdi:waypoint x="-80.0" y="260.0"/>
        <omgdi:waypoint x="-62.5" y="350.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="edge-35b5b177-f96c-4659-8d9f-03372b802253" bpmnElement="sid-fed78b9f-e265-4461-9fbe-3b1f6dcc270c">
        <omgdi:waypoint x="-55.0" y="70.0"/>
        <omgdi:waypoint x="7.5" y="75.0"/>
        <omgdi:waypoint x="60.0" y="95.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="edge-bf0031a9-9ba4-4729-8b3b-0cbebb0bd15b" bpmnElement="sid-6ac4d329-c7ae-445b-91ba-d114977f3eda">
        <omgdi:waypoint x="85.0" y="135.0"/>
        <omgdi:waypoint x="-5.0" y="200.0"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="edge-f90728ad-c571-4d53-bf46-2b4852a960f7" bpmnElement="sid-b96dbee9-98df-44b0-ab83-5772b4d11398">
        <omgdi:waypoint x="-35.000004" y="-135.0"/>
        <omgdi:waypoint x="-35.000008" y="-100.0"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`;