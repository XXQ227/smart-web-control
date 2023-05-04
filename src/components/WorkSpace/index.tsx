import React, {Fragment, useEffect, useState} from 'react';
import {
    CheckOutlined,
    EditOutlined,
    FastBackwardOutlined,
    FastForwardOutlined,
    HomeFilled,
    LockOutlined, PlusOutlined, ReloadOutlined
} from '@ant-design/icons';
import {Button, Col, Form, Layout, List, message, Modal, Popconfirm, Row,} from 'antd';
import ls from 'lodash';
import {Input} from 'antd/es'

const {Header,} = Layout;

type DataSourceType = {
    id: number;
    title?: string | undefined;
};

const data: DataSourceType[] = [
    {
        id: 1,
        title: 'Bayer Project',
    },
    {
        id: 2,
        title: 'Jasolar',
    },
    {
        id: 3,
        title: 'AeonBIG',
    },
    {
        id: 4,
        title: 'My Workspace',
    },
];


const ListItem = List.Item;
const FormItem = Form.Item;

// 父组件传过来的 方法、参数等；需要先在此定义、然后再 <React.FC<Props>> 中调用此类型
export type Props = {
    onChangeGroup: (selectedRows: DataSourceType) => void;
    groupInfo: any,
};

const RightHeaderTags: React.FC<Props> = (props) => {
    const {groupInfo} = props;

    /** 实例化Form */
    const [form] = Form.useForm();

    // TODO: 左侧菜单栏控制
    const [collapsed, setCollapsed] = useState(false);
    // 当没有分组时，不显示，有分组时，显示分组弹框，选默认分组
    const [open, setOpen] = useState<boolean>(!(groupInfo?.id));
    const [openOperate, setOpenOperate] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    // TODO: 鼠标移动所在的行
    const [workSpaceIndex, setWorkSpaceIndex] = useState<number>(-1);

    const [dataSource, setDataSource] = useState<DataSourceType[]>(data || []);

    useEffect(()=> {
        const addWorkspaceObj: DataSourceType | undefined = dataSource.find(x=> x.id === 0);
        if (!(addWorkspaceObj?.id === 0)) {
            // dataSource.splice(0, 0, {id: 0, title: 'add Workspace'})
        }
    }, [dataSource]);

    // 打开/关闭 分组
    const onClick = () => {
        setOpen(!open);
        setCollapsed(!collapsed);
        setWorkSpaceIndex(-1);
    }

    // 打开/关闭 分组
    const onClickOperate = () => {
        setOpenOperate(false);
    }

    // TODO: 确认所选分组
    const onOk = () => {

        onClick();
    }

    /**
     * @Description: TODO 保存分组信息
     * @author XXQ
     * @date 2023/3/29
     * @param record 当前编辑行数据
     * @returns
     */
    const saveRow = (record: DataSourceType) => {
        setLoading(true);
        form.validateFields()
            .then((values) => {
                console.log(values);
                const newData = ls.cloneDeep(dataSource);
                newData.map((item: DataSourceType) => {
                    if (item.id === record.id) {
                        item.title = values[`Workspace${record.id}`];
                    }
                    return item;
                });
                setDataSource(newData);
                // TODO: 初始化数据
                setLoading(false);
                setWorkSpaceIndex(-1);
            })
            .catch((errorInfo) => {
                /** 错误信息 */
                console.log(errorInfo);
                // TODO: 提交失败。弹出错误提示
                const {errorFields} = errorInfo;
                if (errorFields?.length > 0) {
                    const errList = errorFields.map((x: any) => x.errors[0]);
                    // TODO: 去重
                    const errArr: any = Array.from(new Set(errList));
                    const errInfo = errArr.toString().replace(/,/g, ',  /  ');
                    message.error(errInfo);
                }
            });
    }

    /**
     * @Description: TODO: 添加 Workspace
     * @author XXQ
     * @date 2023/5/4
     * @returns
     */
    const handleAddWorkspace = () => {
        const newData: DataSourceType[] = ls.cloneDeep(dataSource);
        newData.splice(0, 0, {id: 0, title: ''});
        setDataSource(newData);
        setWorkSpaceIndex(0);
    }

    /**
     * @Description: TODO: 删除工作空间
     * @author XXQ
     * @date 2023/4/25
     * @param record
     * @returns
     */
    const lockWorkspace = (record: DataSourceType) => {
        const newData = dataSource.filter((item: DataSourceType) => item.id !== record.id) || [];
        setDataSource(newData);
    }

    const handleSelectWorkSpace = (record: DataSourceType) => {
        props.onChangeGroup(record);
    }


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
                footer={null}
                closable={false}
                onCancel={onClick}
                destroyOnClose={true}
                title={
                    <div>
                        <span><FastBackwardOutlined/> Work Space</span>
                        <div className={'ant-operate-work-space'}>
                            <a><span onClick={() => setOpenOperate(true)}>···</span></a>
                        </div>
                    </div>
                }
                className={'ant-right-header-tags-modal-form'}
            >
                <Button onClick={handleAddWorkspace} icon={<PlusOutlined />}>Add workspace</Button>
                <List
                    loading={loading}
                    dataSource={dataSource}
                    itemLayout={'horizontal'}
                    renderItem={(item: DataSourceType, index: number) => (
                        <ListItem
                            // onClick={() => console.log(123123)}
                            // onMouseOver={() => isRename ? null : setWorkSpaceIndex(index)}
                        >
                            <ListItem.Meta
                                // avatar={item.title?.substring(0, 1)}
                                title={
                                    <div className={'ant-input-edit-workspace'}>
                                        <Form form={form}>
                                            <Row gutter={24}>
                                                <Col span={3}>
                                                    <div className={`ant-list-item-meta-avatar ${index === dataSource?.length - 1 ? 'bg-color-blue' : 'bg-color-red'}`}>
                                                        {
                                                            index === dataSource?.length - 1 ?
                                                                <HomeFilled color={'#fff'}/>
                                                                :
                                                                item.title?.substring(0, 1)
                                                        }
                                                    </div>
                                                </Col>
                                                <Col span={16}>
                                                    {workSpaceIndex === index ?
                                                        <FormItem
                                                            initialValue={item.title} name={`Workspace${item.id}`}
                                                            rules={[{
                                                                required: true,
                                                                message: `Workspace is required.`
                                                            }]}
                                                        >
                                                            <Input/>
                                                        </FormItem>
                                                        :
                                                        <div className={'ant-list-item-label'}
                                                             onDoubleClick={() => handleSelectWorkSpace(item)}
                                                        >{item.title}</div>
                                                    }
                                                </Col>
                                                <Col span={2}>
                                                    {workSpaceIndex === index ?
                                                        // TODO: 保存
                                                        <CheckOutlined onClick={() => saveRow(item)} />
                                                        :
                                                        // TODO: 编辑
                                                        <EditOutlined onClick={() => setWorkSpaceIndex(index)} />
                                                    }
                                                </Col>
                                                <Col span={3}>
                                                    {workSpaceIndex === index ?
                                                        // TODO: cancel
                                                        <ReloadOutlined onClick={() => setWorkSpaceIndex(-1)} />
                                                        :
                                                        <Popconfirm
                                                            okText={'Yes'}
                                                            cancelText={'No'}
                                                            placement={'right'}
                                                            title={'Are you sure to lock this workspace?'}
                                                            onConfirm={() => lockWorkspace(item)}
                                                        >
                                                            <LockOutlined />
                                                        </Popconfirm>
                                                    }
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                }
                            />
                        </ListItem>
                    )}
                />
            </Modal>

            <Modal
                width={400}
                onOk={onOk}
                footer={null}
                closable={false}
                open={openOperate}
                destroyOnClose={true}
                onCancel={onClickOperate}
                className={'ant-right-header-tags-modal-form-operate'}
            >
                <Row gutter={24}>
                    <Col span={24}>Rename workspace</Col>
                    <Col span={24}>Change Icon</Col>
                    <Col span={24}>Manage workspace</Col>
                    <Col span={24}>Add workspace</Col>
                    <Col span={24}>View archive</Col>
                </Row>
            </Modal>


        </Fragment>
    )
}
export default RightHeaderTags;