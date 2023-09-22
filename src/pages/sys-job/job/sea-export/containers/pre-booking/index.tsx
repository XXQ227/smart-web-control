import React, {useState} from 'react';
import {Button, Col, Form, Popconfirm, Row, Table} from "antd";
import {ProCard, ProFormText} from "@ant-design/pro-components";
import {
    DeleteOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchModal from "@/components/SearchModal";
import {ID_STRING} from "@/utils/units";
import ls from 'lodash'
import FormItemInput from '@/components/FormItemComponents/FormItemInput'
import FormItemSwitch from '@/components/FormItemComponents/FormItemSwitch'

interface Props {
    form?: any;
    type?: string;
    serviceId: string;
    CTNPlanList?: APIModel.PreBookingList[];
    preBookingList: APIModel.PreBookingList[];
    handleProFormValueChange: (value: any) => void,
}

const FormItem = Form.Item;

const ProBooking: React.FC<Props> = (props) => {
    const {type, form, preBookingList, serviceId} = props;

    const [containerList, setContainerList] = useState<APIModel.PreBookingList[]>(preBookingList);
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
        newData.splice(index, 1, target);
        // TODO: 把数据接口给到 FormItem 表单里
        form.setFieldsValue({
            [`${filedName}_ctn_table_${target.id}`]: target[filedName],
            preBookingContainersEntityList: newData
        });
        setContainerList(newData);
        props.handleProFormValueChange({
            [`${filedName}_ctn_table_${target.id}`]: target[filedName],
            preBookingContainersEntityList: newData
        });
    }

    const preBookingColumns: ColumnsType<APIModel.PreBookingList> = [
        {
            title: 'SIZE',
            dataIndex: 'ctnModelId',
            width: '10%',
            className: "textCenter",
            render: (text: any, record, index) =>
                <FormItem
                    initialValue={record.ctnModelName}
                    name={`ctnModelId_ctn_table_${record.id}`}
                    required rules={[{required: true, message: 'SIZE'}]}
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
                    placeholder={''}
                    initialValue={record.qty}
                    name={`qty_ctn_table_${record.id}`}
                    rules={[{required: true, message: 'QTY'}]}
                    onChange={(e) => onChange(index, record.id, 'qty', e)}
                />,
        },
        {
            title: 'FCL/LCL',
            dataIndex: 'fclFlag',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) =>
                <FormItemSwitch
                    checkedChildren="FCL"
                    unCheckedChildren="LCL"
                    initialValue={record.fclFlag}
                    name={`fclFlag_ctn_table_${record.id}`}
                    onChange={(e) => onChange(index, record.id, 'fclFlag', e)}
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
                    name={`socFlag_ctn_table_${record.id}`}
                    onChange={(e) => onChange(index, record.id, 'socFlag', e)}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'remark',
            render: (text: any, record, index) =>
                <FormItemInput
                    placeholder={''}
                    initialValue={text}
                    name={`Remark_ctn_table_${record.id}`}
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
            qty: 1,
            serviceId,
            fclFlag: false,
            socFlag: false,
            remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData =
            containerList.filter(item => !selectedRowIDs.includes(item.id));
        // TODO: 把数据接口给到 FormItem 表单里
        form.setFieldsValue({preBookingContainersEntityList: newData});
        setContainerList(newData);
        setSelectedRowIDs([]);
    };
    //endregion

    return (
        <ProCard
            hidden={type === 'import'}
            title={'Pre-booking Containers'}
            className={'ant-card'}
            collapsible
            headerBordered
            bordered
        >
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                    <div className={'tableHeaderContainer'}>
                        <Button icon={<PlusCircleOutlined/>} onClick={handleAdd}>Add</Button>
                        <Popconfirm
                            title={'Sure to delete?'}
                            okText={'Yes'} cancelText={'No'}
                            onConfirm={() => handleDelete()}
                            disabled={selectedRowIDs.length === 0}
                        >
                            <Button icon={<DeleteOutlined/>} disabled={selectedRowIDs.length === 0}>Remove</Button>
                        </Popconfirm>
                        <Button icon={<DownloadOutlined/>}>Export Manifest</Button>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={20}>
                    <Table
                        rowKey={'id'}
                        bordered
                        pagination={false}
                        dataSource={containerList}
                        rowSelection={rowSelection}
                        columns={preBookingColumns}
                        locale={{emptyText: "NO DATA"}}
                        className={'tableStyle containerTable'}
                    />

                    {/* // TODO: 用于保存时，获取数据用 */}
                    <ProFormText hidden={true} name={'preBookingContainersEntityList'}/>
                </Col>
            </Row>
        </ProCard>
    )
}
export default ProBooking;