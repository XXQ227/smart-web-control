import React, {useState} from 'react';
import {ProCard, ProFormText, ProFormDateTimePicker} from '@ant-design/pro-components';
import {Col, Row, Form, Space, Button, Table, Popconfirm} from 'antd';
import {PlusCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import SearchModal from "@/components/SearchModal";
import {ID_STRING} from "@/utils/units";
import ls from 'lodash';
import FormItemInput from "@/components/FormItemComponents/FormItemInput";
import FormItemSwitch from "@/components/FormItemComponents/FormItemSwitch";

interface Props {
    // FormItem: any,
    form?: any,
    formRef?: any,
    formCurrent?: any,
    batchNo: string,
    data?: APIModel.BatchData,
    CTNPlanList?: APIModel.PreBookingList[],
    NBasicInfo?: APIModel.NBasicInfo,
}

const FormItem = Form.Item;

const initialContainerList: APIModel.PreBookingList[] = [
    {
        id: 'ID1',
        ctnModelId: 1,
        ctnModelName: "20GP",
        qty: 1,
        socFlag: false,
        Owner: "码头箱主",
        remark: "abcde",
    },
    {
        id: 'ID2',
        ctnModelId: 2,
        ctnModelName: "40GP",
        qty: 2,
        socFlag: true,
        Owner: "Owner456",
        remark: "123",
    },
];

const ContainerLayout: React.FC<Props> = (props) => {
    const  {
        CTNPlanList, form
    } = props;

    const [containerList, setContainerList] = useState<APIModel.PreBookingList[]>(CTNPlanList || initialContainerList);
    const [selectedRowIDs, setSelectedRowIDs] = useState<React.Key[]>([]);

    /**
     * @Description: TODO: 更新预配箱信息
     * @author XXQ
     * @date 2023/8/8
     * @param index
     * @param rowID
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    function onChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        const newData: any[] = ls.cloneDeep(containerList);
        const target = newData.find((item: any)=> item.id === rowID) || {};
        target[filedName] = val?.target ? val.target.value : val;
        // TODO: 需要存箱型名字
        if (filedName === 'ctnModelId') {
            target.ctnModelName = option.label;
        }
        console.log(target);
        newData.splice(index, 1, target);
        // TODO: 把数据接口给到 FormItem 表单里
        form.setFieldsValue({
            [`${filedName}_ctn_table_${target.id}`]: target[filedName],
            containersLoadingDetailEntityList: newData
        });
        setContainerList(newData);
    }

    const columns: ColumnsType<APIModel.PreBookingList> = [
        {
            title: 'SIZE',
            dataIndex: 'ctnModelId',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) =>
                <FormItem
                    required
                    initialValue={record.ctnModelName}
                    name={['0', `ctnModelId_ctn_table_${record.id}`]}
                    rules={[{required: true, message: 'SIZE'}]}
                >
                    <SearchModal
                        qty={30}
                        title={'SIZE'}
                        modalWidth={500}
                        text={record.ctnModelName}
                        query={{dictCode: "ctn_model"}}
                        url={"/apiBase/dict/queryDictDetailCommon"}
                        handleChangeData={(val: any, option: any) => onChange(index, record.id, 'ctnModelId', val, option)}
                    />
                </FormItem>
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) =>
                <FormItemInput
                    required
                    placeholder=''
                    initialValue={record.qty}
                    name={['0', `qty_ctn_table_${record.id}`]}
                    rules={[{required: true, message: 'QTY'}]}
                    onChange={(e) => onChange(index, record.id, 'qty', e)}
                />
        },
        {
            title: 'SOC/COC',
            dataIndex: 'socFlag',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) =>
                <FormItemSwitch
                    checkedChildren="SOC"
                    unCheckedChildren="COC"
                    initialValue={record.socFlag}
                    name={['0', `socFlag_ctn_table_${record.id}`]}
                    onChange={(e) => onChange(index, record.id, 'socFlag', e)}
                />
        },
        {
            title: 'Owner',
            dataIndex: 'Owner',
            render: (text: any, record, index) =>
                <FormItemInput
                    placeholder=''
                    initialValue={text}
                    name={['0', `Owner_ctn_table_${record.id}`]}
                    onChange={(e) => onChange(index, record.id, 'Owner', e)}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',
            key: 'Remark',
            render: (text: any, record, index) =>
                <FormItemInput
                    placeholder=''
                    initialValue={text}
                    name={['0', `Remark_ctn_table_${record.id}`]}
                    onChange={(e) => onChange(index, record.id, 'remark', e)}
                />
        },
    ];

    const rowSelection = {
        columnWidth: 30,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowIDs(selectedRowKeys)
        },
    };

    const handleAdd = () => {
        const newData: APIModel.PreBookingList = {
            id: ID_STRING(),
            ctnModelId: 0,
            ctnModelName: "",
            qty: 1,
            socFlag: false,
            Owner: "",
            remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData =
            containerList.filter(item => !selectedRowIDs.includes(item.id));
        setContainerList(newData);
    };

    return (
        <ProCard
            className={'containerLayout'}
            title={'Task'}
            headerBordered
            collapsible
        >
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={22} xxl={20}>
                    <div className={'container-list-title'}>
                        <div className={'ant-div-left'}>
                            <span>Container List</span>
                        </div>
                        <div className={'ant-div-right'}>
                            <Space>
                                <Button onClick={handleAdd}><PlusCircleOutlined />Add</Button>
                                <Popconfirm
                                    disabled={selectedRowIDs.length === 0}
                                    title={'Sure to delete?'}
                                    okText={'Yes'} cancelText={'No'}
                                    onConfirm={() => handleDelete()}
                                >
                                    <Button disabled={selectedRowIDs.length === 0}><DeleteOutlined />Remove</Button>
                                </Popconfirm>
                            </Space>
                        </div>
                    </div>
                    <Table
                        rowKey={'id'}
                        bordered
                        pagination={false}
                        dataSource={containerList}
                        rowSelection={rowSelection}
                        columns={columns}
                        locale={{emptyText: "NO DATA"}}
                        className={'tableStyle containerTable'}
                    />

                    {/* // TODO: 用于保存时，获取数据用 */}
                    <ProFormText hidden={true} name={'containersLoadingDetailEntityList'}/>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name='placeOfOrigin'
                        label="Pickup Location"
                        placeholder=''
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name='actualPickupTime'
                        label="Pickup Time"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name='containingStuffingDevanning'
                        label="Containing Stuffing & Devanning at"
                        placeholder=''
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name='stuffingDevanningTime'
                        label="Stuffing & Devanning Time"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormText
                        name='placeOfDestination'
                        label="Return Location"
                        placeholder=''
                    />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker
                        name='actualDeliveryTime'
                        label="Return Time"
                        placeholder=''
                        fieldProps={{format: 'YYYY-MM-DD HH:mm'}}
                    />
                </Col>
            </Row>
        </ProCard>
    )
}
export default ContainerLayout;