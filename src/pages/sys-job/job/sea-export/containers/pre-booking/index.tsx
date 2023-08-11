import React, {useState} from 'react';
import {Button, Col, Form, Popconfirm, Row, Table} from "antd";
import {ProCard, ProFormSwitch, ProFormText} from "@ant-design/pro-components";
import {
    DeleteOutlined,
    DownloadOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import type {ColumnsType} from "antd/es/table";
import SearchModal from "@/components/SearchModal";
import {getBranchID} from "@/utils/auths";
import {ID_STRING} from "@/utils/units";
import ls from 'lodash'

interface Props {
    type?: string;
    form?: any;
    CTNPlanList?: APIModel.PreBookingList[];
    preBookingList: APIModel.PreBookingList[];
}

const FormItem = Form.Item;

const ProBooking: React.FC<Props> = (props) => {
    const {type, form, preBookingList} = props;

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
        console.log(index, rowID, filedName, val?.target?.value, option);
        const newData: any[] = ls.cloneDeep(containerList);
        const target = newData.find((item: any)=> item.id === rowID) || {};
        target[filedName] = val?.target ? val.target.value : val;

        newData.splice(index, 1, target);
        // TODO: 把数据接口给到 FormItem 表单里
        form.setFieldsValue({preBookingContainersEntityList: newData});
        setContainerList(newData);
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
                        // value={record.ctnModelName}
                        text={record.ctnModelName}
                        url={"/apiLocal/MCommon/GetCTNModelByStr"}
                        query={{Type: 5, BranchID: getBranchID(), BizType1ID: 1}}
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
                <ProFormText
                    required
                    placeholder={''}
                    initialValue={record.qty}
                    name={`qty_ctn_table_${record.id}`}
                    rules={[{required: true, message: 'QTY'}]}
                    fieldProps={{
                        onChange: (e) => onChange(index, record.id, 'qty', e)
                    }}
                />,
        },
        {
            title: 'FCL/LCL',
            dataIndex: 'fclFlag',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) =>
                <ProFormSwitch
                    checkedChildren="FCL"
                    unCheckedChildren="LCL"
                    initialValue={record.fclFlag}
                    name={`fclFlag_ctn_table_${record.id}`}
                    fieldProps={{
                        onChange: (e) => onChange(index, record.id, 'fclFlag', e)
                    }}
                />
        },
        {
            title: 'SOC/COC',
            dataIndex: 'socFlag',
            align: 'center',
            width: '10%',
            render: (text: any, record, index) =>
                <ProFormSwitch
                    checkedChildren="SOC"
                    unCheckedChildren="COC"
                    initialValue={record.socFlag}
                    name={`socFlag_ctn_table_${record.id}`}
                    fieldProps={{
                        onChange: (e) => onChange(index, record.id, 'socFlag', e)
                    }}
                />
        },
        {
            title: 'Remark',
            dataIndex: 'Remark',
            render: (text: any, record, index) =>
                <ProFormText
                    placeholder={''}
                    initialValue={record.Remark}
                    name={`Remark_ctn_table_${record.id}`}
                    fieldProps={{
                        onChange: (e) => onChange(index, record.id, 'Remark', e)
                    }}
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
            socFlag: false,
            Owner: "",
            Remark: "",
        };
        setContainerList([...containerList, newData]);
    };

    const handleDelete = () => {
        const newData =
            containerList.filter(item => !selectedRowIDs.includes(item.id));
        setContainerList(newData);
    };

    //endregion

    return (
        <ProCard hidden={type === 'import'} title={'Pre-booking Containers'} collapsible headerBordered bordered>
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
                        className={`tableStyle containerTable`}
                    />

                    {/* // TODO: 用于保存时，获取数据用 */}
                    <FormItem hidden={true} name={'preBookingContainersEntityList'} />
                </Col>
            </Row>
        </ProCard>
    )
}
export default ProBooking;