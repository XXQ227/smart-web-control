import React, {Fragment, useRef, useState} from 'react';
import {FastBackwardOutlined, FastForwardOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { EditableProTable,} from '@ant-design/pro-components';
import { Form, Layout, Modal, Popconfirm } from 'antd';
import ls from 'lodash';

const {Header,} = Layout;

type DataSourceType = {
    id: React.Key;
    name?: string;
};

const defaultData: DataSourceType[] = [
    {id: 624748504, name: '晶科'},
    {id: 624691229, name: '晶澳'},
];

// 父组件传过来的 方法、参数等；需要先在此定义、然后再 <React.FC<Props>> 中调用此类型
export type Props = {
    onChangeGroup: (selectedRows: DataSourceType) => void;
    groupInfo: any,
};

const RightHeaderTags: React.FC<Props> = (props) => {
    const {onChangeGroup, groupInfo} = props;
    // TODO: 左侧菜单栏控制
    const [collapsed, setCollapsed] = useState(false);
    // 当没有分组时，不显示，有分组时，显示分组弹框，选默认分组
    const [open, setOpen] = useState(!(groupInfo?.id));
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    // TODO: 分组选中行
    const [slctRowKeys, setSelectedRowKeys] = useState([groupInfo?.id]);
    const [slctRows, setSelectedRows] = useState([]);

    const [form] = Form.useForm();
    const actionRef = useRef<ActionType>();

    // 打开/关闭 分组
    const onClick = () => {
        setOpen(!open);
        setCollapsed(!collapsed);
    }

    // TODO: 确认所选分组
    const onOk = () => {
        let selectedRows: DataSourceType[] = slctRows;
        if (slctRows?.length === 0 && slctRowKeys?.length === 1) {
            selectedRows = dataSource.filter(item => item.id === slctRowKeys[0]);
        }
        onChangeGroup(selectedRows[0]);
        onClick();
    }

    /**
     * @Description: TODO 删除分组
     * @author XXQ
     * @date 2023/3/29
     * @param record 分组行信息
     * @returns
     */
    const removeRow = (record: DataSourceType) => {
        const newData = dataSource.filter(item => item.id !== record.id) || [];
        setDataSource(newData);
    };

    /**
     * @Description: TODO 保存分组信息
     * @author XXQ
     * @date 2023/3/29
     * @param key    当前编辑行 id
     * @param record 当前编辑行数据
     * @returns
     */
    const saveRow = (key: any, record: DataSourceType) => {
        const newData = ls.cloneDeep(dataSource);
        newData.map((item: DataSourceType) => {
            if (item.id === key) {
                item.name = record.name;
            }
            return item;
        });
        setDataSource(newData);
    }

    /**
     * @Description: TODO 选中分组
     * @author XXQ
     * @date 2023/3/29
     * @param record 分组行信息
     * @returns
     */
    const selectRows = (record: DataSourceType) => {
        console.log(record);
    }

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '分区名', dataIndex: 'name', width: '100%', align: 'center',
            formItemProps: {rules: [{required: true, message: '此项为必填项'}]},
            render: (text, record) => [
                <a key="editable" onClick={() => selectRows(record)}>
                    <div>{text}</div>
                </a>,
            ],
        },
        {
            title: '操作', valueType: 'option', align: 'center', width: 150,
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => action?.startEditable?.(record.id)}>edit</a>,
                <Popconfirm
                    key="delete"
                    title={'Are you sure to delete this task?'}
                    placement="top" okText="Yes" cancelText="No"
                    onConfirm={()=> removeRow(record)}
                >
                    <a>delete</a>
                </Popconfirm>
            ],
        },
    ];

    return (
        <Fragment>
            <Header
                onClick={onClick}
                className={'auto-antd-layout-header'} style={{padding: 0}}
            >
                {collapsed ? <FastBackwardOutlined/> : <FastForwardOutlined/>}
            </Header>
            <Modal
                open={open}
                width={400}
                onOk={onOk}
                onCancel={onClick}
                title={'Work Space'}
                className={'ant-right-header-tags-modal-form'}
            >
                <EditableProTable<DataSourceType>
                    rowKey="id"
                    maxLength={5}
                    columns={columns}
                    value={dataSource}
                    actionRef={actionRef}
                    rowSelection={{
                        type: 'radio',
                        alwaysShowAlert: false,
                        selectedRowKeys: slctRowKeys,
                        // 默认选中的行
                        defaultSelectedRowKeys: [624748504],
                        onChange: (selectedRowKeys: any, selectedRows: any)=> {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectedRows(selectedRows);
                        },
                        // columnsWidth: 26,
                        // tableAlertRender: ()=> <div/>,
                        // tableAlertOptionRender: ()=> <div/>,
                    }}
                    onChange={setDataSource}
                    // 新建按钮：false=>默认关闭
                    // recordCreatorProps={false}
                    recordCreatorProps={{
                        // 要增加到哪个节点下，一般用于多重嵌套表格
                        // parentKey: React.key,
                        // 添加显示在顶部
                        position: 'top',
                        // 新增一行的默认是缓存，取消后会消失；如果设置为 dataSource 会触发 onChange，取消后不会消失，只能删除
                        newRecordType: 'dataSource',
                        // 设置按钮名称
                        creatorButtonText: 'Add new Group',
                        // 样式设置
                        style: {top: -95},
                        // 每次新增的时候需要Key
                        record: () => ({ id: Date.now().toString() }),
                    }}
                    // 请求后台获取数据
                    request={async () => ({
                        data: defaultData,
                        total: 3,
                        success: true,
                    })}
                    editable={{
                        form,
                        editableKeys,
                        type: 'multiple',
                        saveText: 'save',
                        deleteText: 'delete',
                        deletePopconfirmMessage: 'Are you sure to delete this task?',
                        cancelText: 'cancel',
                        onSave: async (rowKey, data) => saveRow(rowKey, data),
                        // 只能编辑一行
                        onlyOneLineEditorAlertMessage: 'Only edit 1 line!',
                        // 只能新增一行
                        onlyAddOneLineAlertMessage: 'Only add 1 line!',
                        // 行数据修改时触发
                        onChange: setEditableRowKeys,
                        // 自定义编辑模式的操作栏。第三个参数是默认按钮defaultDom，
                        // 默认有保存（dom.save），取消（dom.cancel），删除（dom.delete）按钮，可以自行配置
                        actionRender: (row, config, dom) => {
                            const result = [dom.save, dom.delete];
                            // 当 <id> 是字符串时，不显示取消 <未保存的不做【取消】操作>
                            if (typeof row.id !== 'string') {
                                result.splice(1, 0, dom.cancel);
                            }
                            return result
                        },
                    }} />
            </Modal>
        </Fragment>
    )
}
export default RightHeaderTags;