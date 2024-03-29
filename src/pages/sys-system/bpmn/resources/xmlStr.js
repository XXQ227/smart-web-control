export const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">
  <process id="ev-global" name="ev-global" isExecutable="true">
    <sequenceFlow id="Flow_107n7hz" sourceRef="Activity_1wufezc" targetRef="Activity_0yqfdpe" />
    <sequenceFlow id="Flow_1d2gv7g" sourceRef="Activity_1e6xdzp" targetRef="Activity_0yqfdpe" />
    <sequenceFlow id="Flow_1bwuzcj" sourceRef="Activity_0hg94dx" targetRef="Activity_0yqfdpe" />
    <sequenceFlow id="Flow_0dz0nu9" sourceRef="Activity_0f8nyx9" targetRef="Activity_0hg94dx" />
    <sequenceFlow id="Flow_1d8xabe" sourceRef="Activity_0f8nyx9" targetRef="Activity_1wufezc" />
    <sequenceFlow id="Flow_0ijijyt" sourceRef="Activity_0f8nyx9" targetRef="Activity_1e6xdzp" />
    <sequenceFlow id="Flow_00tbjwr" name="超额" sourceRef="Gateway_0w8wtrs" targetRef="Activity_0f8nyx9" />
    <sequenceFlow id="Flow_02s755t" name="末超" sourceRef="Gateway_0w8wtrs" targetRef="Event_1kpnt0m" />
    <sequenceFlow id="Flow_1ali1l8" name="驳回" sourceRef="Gateway_0gzabj6" targetRef="Event_17c4mky" />
    <sequenceFlow id="Flow_0bpscsh" name="驳回" sourceRef="Gateway_1o3xjtn" targetRef="Event_17c4mky" />
    <sequenceFlow id="Flow_0xdofqo" sourceRef="Event_17c4mky" targetRef="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0" />
    <sequenceFlow id="Flow_07hvy5h" name="驳回" sourceRef="Gateway_0c98i0f" targetRef="Event_17c4mky" />
    <sequenceFlow id="Flow_1aoky43" sourceRef="Activity_1mcxi49" targetRef="Gateway_0gzabj6" />
    <sequenceFlow id="Flow_010xcrp" name="同意" sourceRef="Gateway_1o3xjtn" targetRef="Activity_1mcxi49" />
    <sequenceFlow id="Flow_06dfcdf" name="同意" sourceRef="Gateway_0c98i0f" targetRef="Activity_1lfdd3m" />
    <sequenceFlow id="Flow_1o33jer" sourceRef="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0" targetRef="Gateway_0c98i0f" />
    <sequenceFlow id="Flow_17sei45" sourceRef="Activity_040rj4o" targetRef="Gateway_0w8wtrs" />
    <sequenceFlow id="Flow_0lzkpdy" name="同意" sourceRef="Gateway_0gzabj6" targetRef="Activity_040rj4o" />
    <sequenceFlow id="Flow_18qzeft" sourceRef="Activity_1lfdd3m" targetRef="Gateway_1o3xjtn" />
    <userTask id="Activity_0yqfdpe" name="信控组长审批">
      <incoming>Flow_1bwuzcj</incoming>
      <incoming>Flow_1d2gv7g</incoming>
      <incoming>Flow_107n7hz</incoming>
      <outgoing>Flow_0y00quy</outgoing>
      <outgoing>Flow_1sbmhyo</outgoing>
    </userTask>
    <userTask id="Activity_0f8nyx9" name="事业部经理">
      <incoming>Flow_00tbjwr</incoming>
      <outgoing>Flow_0ijijyt</outgoing>
      <outgoing>Flow_1d8xabe</outgoing>
      <outgoing>Flow_0dz0nu9</outgoing>
    </userTask>
    <exclusiveGateway id="Gateway_0w8wtrs" name="判断是否超额">
      <incoming>Flow_17sei45</incoming>
      <outgoing>Flow_02s755t</outgoing>
      <outgoing>Flow_00tbjwr</outgoing>
    </exclusiveGateway>
    <endEvent id="Event_1kpnt0m" name="结束">
      <incoming>Flow_02s755t</incoming>
      <incoming>Flow_0v011i7</incoming>
    </endEvent>
    <userTask id="Activity_1wufezc" name="财务部">
      <incoming>Flow_1d8xabe</incoming>
      <outgoing>Flow_107n7hz</outgoing>
    </userTask>
    <userTask id="Activity_1e6xdzp" name="运营部">
      <incoming>Flow_0ijijyt</incoming>
      <outgoing>Flow_1d2gv7g</outgoing>
    </userTask>
    <userTask id="Activity_0hg94dx" name="市场部">
      <incoming>Flow_0dz0nu9</incoming>
      <outgoing>Flow_1bwuzcj</outgoing>
    </userTask>
    <intermediateThrowEvent id="Event_17c4mky" name="开始">
      <incoming>Flow_07hvy5h</incoming>
      <incoming>Flow_0bpscsh</incoming>
      <incoming>Flow_1ali1l8</incoming>
      <incoming>Flow_0uexg8c</incoming>
      <incoming>Flow_0z6mj7n</incoming>
      <incoming>Flow_0flyu2p</incoming>
      <outgoing>Flow_0xdofqo</outgoing>
    </intermediateThrowEvent>
    <exclusiveGateway id="Gateway_0gzabj6" name="是否同意">
      <incoming>Flow_1aoky43</incoming>
      <outgoing>Flow_0lzkpdy</outgoing>
      <outgoing>Flow_1ali1l8</outgoing>
    </exclusiveGateway>
    <exclusiveGateway id="Gateway_1o3xjtn" name="是否同意">
      <incoming>Flow_18qzeft</incoming>
      <outgoing>Flow_010xcrp</outgoing>
      <outgoing>Flow_0bpscsh</outgoing>
    </exclusiveGateway>
    <userTask id="Activity_1lfdd3m" name="主管确认&#10;移交财务">
      <incoming>Flow_06dfcdf</incoming>
      <outgoing>Flow_18qzeft</outgoing>
    </userTask>
    <userTask id="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0" name="销售提交&#10;移交主管" activiti:assignee="1">
      <incoming>Flow_0xdofqo</incoming>
      <outgoing>Flow_1o33jer</outgoing>
    </userTask>
    <exclusiveGateway id="Gateway_0c98i0f" name="是否同意">
      <incoming>Flow_1o33jer</incoming>
      <outgoing>Flow_06dfcdf</outgoing>
      <outgoing>Flow_07hvy5h</outgoing>
    </exclusiveGateway>
    <userTask id="Activity_040rj4o" name="总经理确认">
      <incoming>Flow_0lzkpdy</incoming>
      <outgoing>Flow_17sei45</outgoing>
    </userTask>
    <userTask id="Activity_1mcxi49" name="财务确认&#10;移交公司总经理">
      <incoming>Flow_010xcrp</incoming>
      <outgoing>Flow_1aoky43</outgoing>
    </userTask>
    <task id="Activity_1wldrd7" name="分管领导审批">
      <incoming>Flow_0y00quy</incoming>
      <outgoing>Flow_13atetm</outgoing>
      <outgoing>Flow_02iun45</outgoing>
    </task>
    <sequenceFlow id="Flow_0y00quy" name="同意" sourceRef="Activity_0yqfdpe" targetRef="Activity_1wldrd7" />
    <task id="Activity_0blu30o" name="总经理审批">
      <incoming>Flow_13atetm</incoming>
      <outgoing>Flow_0flyu2p</outgoing>
      <outgoing>Flow_0v011i7</outgoing>
    </task>
    <sequenceFlow id="Flow_13atetm" name="同意" sourceRef="Activity_1wldrd7" targetRef="Activity_0blu30o" />
    <exclusiveGateway id="Gateway_0iobu59">
      <incoming>Flow_1sbmhyo</incoming>
      <outgoing>Flow_0uexg8c</outgoing>
    </exclusiveGateway>
    <sequenceFlow id="Flow_1sbmhyo" sourceRef="Activity_0yqfdpe" targetRef="Gateway_0iobu59" />
    <sequenceFlow id="Flow_0uexg8c" name="驳回" sourceRef="Gateway_0iobu59" targetRef="Event_17c4mky" />
    <exclusiveGateway id="Gateway_04h8lfg">
      <incoming>Flow_02iun45</incoming>
      <outgoing>Flow_0z6mj7n</outgoing>
    </exclusiveGateway>
    <sequenceFlow id="Flow_0z6mj7n" name="驳回" sourceRef="Gateway_04h8lfg" targetRef="Event_17c4mky" />
    <sequenceFlow id="Flow_02iun45" sourceRef="Activity_1wldrd7" targetRef="Gateway_04h8lfg" />
    <sequenceFlow id="Flow_0flyu2p" name="驳回" sourceRef="Activity_0blu30o" targetRef="Event_17c4mky" />
    <sequenceFlow id="Flow_0v011i7" name="同意" sourceRef="Activity_0blu30o" targetRef="Event_1kpnt0m" />
    <group id="Group_1fcm1hv" categoryValueRef="CategoryValue_1mi20en" />
  </process>
  <category id="Category_0b19dvo">
    <categoryValue id="CategoryValue_1mi20en" value="信控小组审批" />
  </category>
  <bpmndi:BPMNDiagram id="BPMNDiagram_ev-global">
    <bpmndi:BPMNPlane id="BPMNPlane_ev-global" bpmnElement="ev-global">
      <bpmndi:BPMNEdge id="Flow_0v011i7_di" bpmnElement="Flow_0v011i7">
        <omgdi:waypoint x="-500" y="250" />
        <omgdi:waypoint x="-500" y="444" />
        <omgdi:waypoint x="-108" y="444" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-496" y="344" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0flyu2p_di" bpmnElement="Flow_0flyu2p">
        <omgdi:waypoint x="-500" y="170" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-496" y="103" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_02iun45_di" bpmnElement="Flow_02iun45">
        <omgdi:waypoint x="-355" y="170" />
        <omgdi:waypoint x="-355" y="93" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0z6mj7n_di" bpmnElement="Flow_0z6mj7n">
        <omgdi:waypoint x="-380" y="68" />
        <omgdi:waypoint x="-500" y="68" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-451" y="50" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0uexg8c_di" bpmnElement="Flow_0uexg8c">
        <omgdi:waypoint x="-215" y="30" />
        <omgdi:waypoint x="-500" y="30" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-368" y="12" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1sbmhyo_di" bpmnElement="Flow_1sbmhyo">
        <omgdi:waypoint x="-190" y="170" />
        <omgdi:waypoint x="-190" y="55" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_13atetm_di" bpmnElement="Flow_13atetm">
        <omgdi:waypoint x="-400" y="210" />
        <omgdi:waypoint x="-450" y="210" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-436" y="192" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0y00quy_di" bpmnElement="Flow_0y00quy">
        <omgdi:waypoint x="-240" y="210" />
        <omgdi:waypoint x="-300" y="210" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-281" y="192" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_18qzeft_di" bpmnElement="Flow_18qzeft">
        <omgdi:waypoint x="-100" y="-190" />
        <omgdi:waypoint x="-100" y="-260" />
        <omgdi:waypoint x="-35" y="-260" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0lzkpdy_di" bpmnElement="Flow_0lzkpdy">
        <omgdi:waypoint x="240" y="-260" />
        <omgdi:waypoint x="360" y="-260" />
        <omgdi:waypoint x="360" y="-190" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="290" y="-278" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_17sei45_di" bpmnElement="Flow_17sei45">
        <omgdi:waypoint x="380" y="-110" />
        <omgdi:waypoint x="380" y="185" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1o33jer_di" bpmnElement="Flow_1o33jer">
        <omgdi:waypoint x="-300" y="-190" />
        <omgdi:waypoint x="-300" y="-260" />
        <omgdi:waypoint x="-235" y="-260" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06dfcdf_di" bpmnElement="Flow_06dfcdf">
        <omgdi:waypoint x="-185" y="-260" />
        <omgdi:waypoint x="-131" y="-260" />
        <omgdi:waypoint x="-131" y="-190" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-169" y="-278" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_010xcrp_di" bpmnElement="Flow_010xcrp">
        <omgdi:waypoint x="15" y="-260" />
        <omgdi:waypoint x="80" y="-260" />
        <omgdi:waypoint x="80" y="-190" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="36" y="-278" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1aoky43_di" bpmnElement="Flow_1aoky43">
        <omgdi:waypoint x="130" y="-190" />
        <omgdi:waypoint x="130" y="-260" />
        <omgdi:waypoint x="185" y="-260" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_07hvy5h_di" bpmnElement="Flow_07hvy5h">
        <omgdi:waypoint x="-210" y="-235" />
        <omgdi:waypoint x="-210" y="-80" />
        <omgdi:waypoint x="-500" y="-80" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-366" y="-98" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0xdofqo_di" bpmnElement="Flow_0xdofqo">
        <omgdi:waypoint x="-482" y="-140" />
        <omgdi:waypoint x="-350" y="-140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0bpscsh_di" bpmnElement="Flow_0bpscsh">
        <omgdi:waypoint x="-10" y="-235" />
        <omgdi:waypoint x="-10" y="-60" />
        <omgdi:waypoint x="-500" y="-60" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-266" y="-78" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1ali1l8_di" bpmnElement="Flow_1ali1l8">
        <omgdi:waypoint x="210" y="-235" />
        <omgdi:waypoint x="210" y="-40" />
        <omgdi:waypoint x="-500" y="-40" />
        <omgdi:waypoint x="-500" y="-122" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-156" y="-58" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_02s755t_di" bpmnElement="Flow_02s755t">
        <omgdi:waypoint x="380" y="235" />
        <omgdi:waypoint x="380" y="444" />
        <omgdi:waypoint x="-72" y="444" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="388" y="333" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_00tbjwr_di" bpmnElement="Flow_00tbjwr">
        <omgdi:waypoint x="355" y="210" />
        <omgdi:waypoint x="260" y="210" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="296" y="192" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ijijyt_di" bpmnElement="Flow_0ijijyt">
        <omgdi:waypoint x="160" y="210" />
        <omgdi:waypoint x="43" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1d8xabe_di" bpmnElement="Flow_1d8xabe">
        <omgdi:waypoint x="160" y="210" />
        <omgdi:waypoint x="102" y="210" />
        <omgdi:waypoint x="102" y="320" />
        <omgdi:waypoint x="43" y="320" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0dz0nu9_di" bpmnElement="Flow_0dz0nu9">
        <omgdi:waypoint x="160" y="210" />
        <omgdi:waypoint x="102" y="210" />
        <omgdi:waypoint x="102" y="90" />
        <omgdi:waypoint x="40" y="90" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1bwuzcj_di" bpmnElement="Flow_1bwuzcj">
        <omgdi:waypoint x="-60" y="90" />
        <omgdi:waypoint x="-100" y="90" />
        <omgdi:waypoint x="-100" y="210" />
        <omgdi:waypoint x="-140" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1d2gv7g_di" bpmnElement="Flow_1d2gv7g">
        <omgdi:waypoint x="-57" y="210" />
        <omgdi:waypoint x="-140" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_107n7hz_di" bpmnElement="Flow_107n7hz">
        <omgdi:waypoint x="-57" y="320" />
        <omgdi:waypoint x="-100" y="320" />
        <omgdi:waypoint x="-100" y="210" />
        <omgdi:waypoint x="-140" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Activity_0yqfdpe_di" bpmnElement="Activity_0yqfdpe">
        <omgdc:Bounds x="-240" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_00jz54w_di" bpmnElement="Activity_0f8nyx9">
        <omgdc:Bounds x="160" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_081lu8o_di" bpmnElement="Gateway_0w8wtrs" isMarkerVisible="true">
        <omgdc:Bounds x="355" y="185" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="414.5" y="203" width="67" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1kpnt0m_di" bpmnElement="Event_1kpnt0m">
        <omgdc:Bounds x="-108" y="426" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-101" y="469" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1wufezc_di" bpmnElement="Activity_1wufezc">
        <omgdc:Bounds x="-57" y="280" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1e6xdzp_di" bpmnElement="Activity_1e6xdzp">
        <omgdc:Bounds x="-57" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0hg94dx_di" bpmnElement="Activity_0hg94dx">
        <omgdc:Bounds x="-60" y="50" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_17c4mky_di" bpmnElement="Event_17c4mky">
        <omgdc:Bounds x="-518" y="-158" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-511" y="-188" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0gzabj6_di" bpmnElement="Gateway_0gzabj6" isMarkerVisible="true">
        <omgdc:Bounds x="185" y="-285" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="187" y="-309" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1o3xjtn_di" bpmnElement="Gateway_1o3xjtn" isMarkerVisible="true">
        <omgdc:Bounds x="-35" y="-285" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-33" y="-309" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1lfdd3m_di" bpmnElement="Activity_1lfdd3m">
        <omgdc:Bounds x="-160" y="-190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="shape-93885be7-3106-490f-a662-4b5eeb5f9595" bpmnElement="sid-18e7b453-1439-41d8-a2b8-ec5cefcf1ff0">
        <omgdc:Bounds x="-350" y="-190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0c98i0f_di" bpmnElement="Gateway_0c98i0f" isMarkerVisible="true">
        <omgdc:Bounds x="-235" y="-285" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-233" y="-309" width="45" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_040rj4o_di" bpmnElement="Activity_040rj4o">
        <omgdc:Bounds x="330" y="-190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1mcxi49_di" bpmnElement="Activity_1mcxi49">
        <omgdc:Bounds x="50" y="-190" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1wldrd7_di" bpmnElement="Activity_1wldrd7">
        <omgdc:Bounds x="-400" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0blu30o_di" bpmnElement="Activity_0blu30o">
        <omgdc:Bounds x="-550" y="170" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0iobu59_di" bpmnElement="Gateway_0iobu59" isMarkerVisible="true">
        <omgdc:Bounds x="-215" y="5" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_04h8lfg_di" bpmnElement="Gateway_04h8lfg" isMarkerVisible="true">
        <omgdc:Bounds x="-380" y="43" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Group_1fcm1hv_di" bpmnElement="Group_1fcm1hv">
        <omgdc:Bounds x="-260" y="-10" width="400" height="380" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="-93" y="-3" width="67" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;