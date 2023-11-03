import React, {useState} from 'react'
import {Form, message, Modal, Tree } from 'antd'
import {ProForm} from '@ant-design/pro-components'
import type { TreeProps } from 'antd/es/tree';
import ls from 'lodash'
import {DownOutlined} from '@ant-design/icons'

interface Props {
    open: boolean;          // TODO: 弹框显示状态
    authListVO: any[];            // TODO: 当前编辑数据集
    handleCancel: () => void;   // TODO: 关闭弹框
    handleSaveAuth: (val: any) => void;   // TODO: 关闭弹框
}

const AuthListTree: React.FC<Props> = (props) => {

    const {open, authListVO, handleCancel} = props;
    const [form] = Form.useForm();

    // TODO: 被选中的权限
    const [_viewAuthKeys, setViewAuthKeys] = useState<React.Key[]>([]);
    const [_editAuthKeys, setEditAuthKeys] = useState<React.Key[]>([]);
    const [checkedAuthKeys, setCheckedAuthKeys] = useState<React.Key[]>([]);
    const [expandedAuthKeys, setExpandedAuthKeys] = useState<React.Key[]>([]);

    /**
     * @Description: TODO: 获取选种的权限列
     * @author XXQ
     * @date 2023/11/2
     * @param data  权限数据
     * @returns
     */
    function _getFuncAuthRoute(data: any[]) {
        const result: any[] = [];
        if (data.length > 0) {
            data.map((item: any)=> {
                if (checkedAuthKeys?.length > 0) {
                    // TODO: 判断该菜单权限是否有子级(或者本身)被选过
                    const checkedArr: any[] = checkedAuthKeys.filter((x: any)=> x.indexOf(item.identityCode) > -1) || [];
                    // TODO: 当存在时返回该数据，否则过滤当前数据
                    if (checkedArr.length > 0) {
                        result.push(item);
                    }
                    // TODO: 如果有子权限
                    if (item.children?.length > 0) item.children = _getFuncAuthRoute(item.children);
                }
            })
        }

        return result;
    }

    /**
     * @Description: TODO: 获取选种的权限列
     * @author XXQ
     * @date 2023/11/2
     * @param data  权限数据
     * @returns
     */
    function _getFuncAuthIdentityCode(data: any[]) {
        const result: any[] = [];
        if (data.length > 0) {
            data.map((item: any)=> {
                result.push(item.identityCode);
                if (item.children?.length > 0) {
                    // TODO: 获取 child 的权限
                    const childAuthArr: any[] = _getFuncAuthIdentityCode(item.children) || [];
                    const identityArr: any[] = childAuthArr?.map((x: any)=> x) || [];
                    // TODO: 存下 child 权限集合
                    result.push(...identityArr);
                }
            })
        }
        return result;
    }

    /**
     * @Description: TODO: 获取选种的权限列
     * @author XXQ
     * @date 2023/11/2
     * @param data  权限数据
     * @returns
     */
    function _getFuncAuthId(data: any[]) {
        const result: any[] = [];
        if (data.length > 0) {
            data.map((item: any)=> {
                result.push(item.id);
                if (item.children?.length > 0) {
                    // TODO: 存下 child 权限集合 <id>
                    const childAuthArr: any[] = _getFuncAuthId(item.children);
                    // TODO: 存下 child 权限集合 <id>
                    const idArr: any[] = childAuthArr.map((x: any)=> x) || [];
                    result.push(...idArr);
                }
            })
        }
        return result;
    }

    const handleOk = () => {
        const authCloneArr: any[] = ls.cloneDeep(authListVO) || [];
        const newData: any[] = _getFuncAuthRoute(authCloneArr);
        const _newAuthArr: any[] = _getFuncAuthIdentityCode(newData);
        const _newAuthIdArr: any[] = _getFuncAuthId(newData);
        // TODO: params
        const params = {
            // routeJson: JSON.stringify(newData),
            // authJson: JSON.stringify(_newAuthArr),
            routeJson: '',
            authJson: _newAuthArr.toString(),
            authorityIds: _newAuthIdArr,
        }
        props.handleSaveAuth(params);
    }


    const onSelect = (selectedKeys: React.Key[], info: any) => {
        // console.log('selected', selectedKeys, info);
        let newData: any[] = ls.cloneDeep(expandedAuthKeys) || [];
        // TODO: 展开当前行
        if (info.selected) {
            newData.push(...selectedKeys);
        } else {
            // @ts-ignore TODO: 关闭当前行
            newData = newData.filter(x=> x !== (info?.node?.identityCode || '')) || [];
        }
        setExpandedAuthKeys(newData);
    };

    const onCheck: TreeProps['onCheck'] = (checkedKeys: React.Key[], info: any) => {
        // TODO: 仅操作权限做判断
        if (info?.node?.type === 2) {
            // TODO: 获取 【_view】 前面的字符名
            const identityCodeStr: string = info?.node?.identityCode.substring(0, info?.node?.identityCode.lastIndexOf('_'));
            // TODO: 判断是不是【仅查看】权限
            if (info?.node?.identityCode.indexOf('_view') > -1) {
                if (_editAuthKeys.includes(identityCodeStr)) {
                    return message.warning('[Editing/Freezing] permissions have already been selected; [View Only] permissions cannot be chosen additionally.');
                } else {
                    let _viewAuthArr: any[] = ls.cloneDeep(_viewAuthKeys) || [];
                    // TODO: 选中则赋值进去; 否则过滤掉
                    if (info?.checked) {
                        _viewAuthArr.push(identityCodeStr);
                    } else {
                        _viewAuthArr = _viewAuthArr.filter((x: any) => x !== identityCodeStr);
                    }
                    setViewAuthKeys(_viewAuthArr);
                }
            } else {
                // TODO: 已选了【仅查看】时，不能再选其他的权限（仅同操作页）
                if (_viewAuthKeys.includes(identityCodeStr)) {
                    return message.warning('[View Only] permissions have already been selected; [Editing/Freezing] permissions cannot be chosen additionally.');
                } else {
                    let _editAuthArr: any[] = ls.cloneDeep(_editAuthKeys) || [];
                    // TODO: 选中则赋值进去; 否则过滤掉
                    if (info?.checked) {
                        if (!_editAuthArr.includes('identityCodeStr')) _editAuthArr.push(identityCodeStr);
                    } else {
                        _editAuthArr = _editAuthArr.filter((x: any) => x !== identityCodeStr);
                    }
                    setEditAuthKeys(_editAuthArr);
                }
            }
        }
        setCheckedAuthKeys(checkedKeys);
    };

    const onExpand = (expandedKeysValue: React.Key[]) => {
        // console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedAuthKeys(expandedKeysValue);
    };

    return (
        <Modal
            open={open}
            width={1000}
            title={'Auth'}
            okText={'OK'}
            onOk={handleOk}
            cancelText={'Cancel'}
            onCancel={handleCancel}
        >
            <ProForm
                form={form}
                submitter={false}
                layout={'vertical'}
            >
                <Tree
                    showLine
                    checkable
                    autoExpandParent
                    switcherIcon={<DownOutlined />}
                    className={'ant-tree-auth-select'}
                    // TODO: 选中的
                    checkedKeys={checkedAuthKeys}
                    expandedKeys={expandedAuthKeys}
                    // TODO: 展开的，不一定是选中的。
                    onExpand={onExpand} onCheck={onCheck} onSelect={onSelect}
                    treeData={authListVO}
                    titleRender={(nodeData: any)=> {
                        return nodeData.name;
                    }}
                />
            </ProForm>
        </Modal>
    )
}

export default AuthListTree;