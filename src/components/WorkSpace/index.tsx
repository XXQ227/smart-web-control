import React, {Fragment, useState} from 'react';
import {FastBackwardOutlined, FastForwardOutlined} from '@ant-design/icons';
import {Col, Layout, List, Modal, Row, Space,} from 'antd';
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

// 父组件传过来的 方法、参数等；需要先在此定义、然后再 <React.FC<Props>> 中调用此类型
export type Props = {
    onChangeGroup: (selectedRows: DataSourceType) => void;
    groupInfo: any,
};

const RightHeaderTags: React.FC<Props> = (props) => {
    const {groupInfo} = props;
    // TODO: 左侧菜单栏控制
    const [collapsed, setCollapsed] = useState(false);
    // 当没有分组时，不显示，有分组时，显示分组弹框，选默认分组
    const [open, setOpen] = useState<boolean>(!(groupInfo?.id));
    const [openOperate, setOpenOperate] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    // TODO: 当前 workspace 是否有编辑且未保存判断
    const [isRename, setIsRename] = useState<boolean>(false);
    // TODO: 鼠标移动所在的行
    const [workSpaceIndex, setWorkSpaceIndex] = useState<number>(-1);
    const [workSpaceVal, setWorkSpaceVal] = useState<string>('');

    const [dataSource, setDataSource] = useState<DataSourceType[]>(data || []);

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
     * @param val    当前编辑行 id
     * @param record 当前编辑行数据
     * @returns
     */
    const saveRow = (val: any, record: DataSourceType) => {
        setLoading(true);
        const newData = ls.cloneDeep(dataSource);
        newData.map((item: DataSourceType) => {
            if (item.id === record.id) {
                item.title = val;
            }
            return item;
        });
        setDataSource(newData);
        // TODO: 初始化数据
        setLoading(false);
        setIsRename(false);
        setWorkSpaceIndex(-1);
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
                <List
                    loading={loading}
                    dataSource={dataSource}
                    itemLayout={'horizontal'}
                    renderItem={(item: DataSourceType, index: number) => (
                        <ListItem onMouseOver={() => isRename ? null : setWorkSpaceIndex(index)}>
                            <ListItem.Meta
                                title={workSpaceIndex !== index ? item.title :
                                    <div className={'ant-input-edit-workspace'}>
                                        <Space>
                                            <Input
                                                defaultValue={item.title}
                                                onBlur={(e: any) => setWorkSpaceVal(e?.target?.value)}
                                                onChange={()=> isRename ? null : setIsRename(true)}
                                            />
                                            <label onChange={()=> saveRow(workSpaceVal, item)}>save</label>
                                            <label>delete</label>
                                        </Space>
                                    </div>
                                }
                                avatar={item.title?.substring(0, 1)}
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