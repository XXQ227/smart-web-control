import React, {useEffect, useState} from 'react';
import {ProTable} from '@ant-design/pro-components'
import '@/global.less'

interface Props {
    dataSource: any[];
    loading: boolean;
    isReload: boolean;
    columns: any;
    expandedColumns: any;
    handleChangeReload: () => void;
    handleSetSelectVal: (val: any) => void;
}

const ExpandTable: React.FC<Props> = (props) => {
    const {
        columns, expandedColumns, loading, isReload,
        handleSetSelectVal,  handleChangeReload
    } = props;

    // const [dataSource, setDataSource] = useState<any[]>(props.dataSource || []);

    // TODO: 父数据列数据
    const [selectRows, setSelectRows] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // TODO: 子单选中列数据
    const [selectChildRows, setSelectChildRows] = useState<any[]>([]);
    const [selectedChildKeys, setSelectedChildKeys] = useState<React.Key[]>([]);


    useEffect(()=> {
        // TODO: 更新选中的费用数据
        if (isReload) {
            setSelectRows([]);
            setSelectedKeys([]);
            setSelectChildRows([]);
            setSelectedChildKeys([]);
            handleChangeReload();
        }
    }, [isReload])

    //region 主表格复选按钮
    /**
     * @Description: TODO: 单行选中、取消
     * @author XXQ
     * @date 2023/8/16
     * @param record    当前行数据
     * @param selected    当前行数据
     * @returns
     */
    const onSelect = (record: any, selected: boolean) => {
        // TODO: 拿到选中行的所以 费用 id
        let childIdArr: any[] = record.child?.map((item: any) => item.id) || [];
        // TODO: 已被选中的费用 id
        let childKeys: React.Key[] = selectedChildKeys.slice(0),
            childRows: any[] = selectChildRows.slice(0);
        if (selected) {
            // TODO: 过滤被选中的费用 id
            childIdArr = childIdArr.filter((key: string) => !childKeys.includes(key));
            const newChildRows: any[] = record.child.filter((item: any)=> childIdArr.includes(item.id));
            // TODO: 选中添加 当前行的费用
            childKeys.push(...childIdArr);
            childRows.push(...newChildRows);
        } else {
            // TODO: 取消选中：删除当前行的费用
            childRows = childRows.filter((item: any) => !childIdArr.includes(item.id));
            childKeys = childKeys.filter((key: React.Key) => !childIdArr.includes(key));
        }
        setSelectChildRows(childRows);
        setSelectedChildKeys(childKeys);
        handleSetSelectVal({child: {selectChildRows: childRows, selectedChildKeys: childKeys}});
    }

    /**
     * @Description: TODO: 全选、取消
     * @author XXQ
     * @date 2023/8/16
     * @param selected      当前行数据
     * @param selectedRow   当前行数据
     * @returns
     */
    const onSelectAll = (selected: boolean, selectedRow: any) => {
        const childKeys: React.Key[] = [];
        const childRows: any[] = [];
        // TODO: 全选选中所有的费用行 id
        if (selected) {
            let childIdArr: React.Key[] = [], childArr: any[] = [];
            if (selectedRow?.length > 0) {
                childArr = selectedRow.map((item: any) => item.child).flat();
                childIdArr = selectedRow.map((item: any) => item.child?.map((cg: any) => cg.id)).flat();
            }
            // TODO: 选中添加 当前行的费用
            childRows.push(...childArr);
            childKeys.push(...childIdArr);
        }
        setSelectChildRows(childRows);
        setSelectedChildKeys(childKeys);
        handleSetSelectVal({child: {selectChildRows: childRows, selectedChildKeys: childKeys}});
    }

    const rowSelection = {
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedKeys(selectedRowKeys);
            setSelectRows(selectedRows);
            handleSetSelectVal({parent: {selectRows: selectedRows, selectedKeys: selectedRowKeys}});
        },
        onSelect: onSelect,
        onSelectAll: onSelectAll,
        // getCheckboxProps: (record: any) => ({
        //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    //endregion


    //region 子表格复选按钮
    /**
     * @Description: TODO: 单行选中、取消
     * @author XXQ
     * @date 2023/8/16
     * @param record    当前行的数据 【object】
     * @param selected  选中状态 【true/false】
     * @param parenRecord    当前行父级数据
     * @returns
     */
    const onSelectChild = (record: any, selected: boolean, parenRecord: any) => {
        let childKeys: React.Key[] = selectedChildKeys.slice(0);
        let childRows: any[] = selectChildRows.slice(0);
        let selectParams: any = {};
        // TODO: 选中一个，存一个；取消一个，则删除一个
        if (selected) {
            // TODO: 选中添加 当前行的费用
            childRows.push(record);
            childKeys.push(record.id);
        } else {
            // TODO: 取消选中：删除当前行的费用
            childRows = childRows.filter((item: any) => item.id !== record.id);
            childKeys = childKeys.filter((key: React.Key) => key !== record.id);
        }
        //region TODO: 以下判断是否需要选中父级数据
        // TODO: 获取当前 job 下所有费用条数
        const childIdArr: React.Key[] = parenRecord.child?.map((cg: any) => cg.id);
        // TODO: 找出当前 job 下的费用，在选中的费用行中有多少条
        const selectedIds: React.Key[] = childKeys.filter((key: React.Key) => childIdArr.includes(key));
        // TODO: 当选中的费用等于所有费用时，父级数据也一并被选中
        if (selectedIds?.length === childIdArr?.length) {
            const parentRows: any[] = selectRows.slice(0);
            const parentKeys: any[] = selectedKeys.slice(0);
            parentRows.push(parenRecord);
            parentKeys.push(parenRecord.id);
            setSelectRows(parentRows);
            setSelectedKeys(parentKeys);
            selectParams = {parent: {selectRows: parentRows, selectedKeys: parentKeys}};
        }
        // TODO: 当是取消选中且选中的条数比 state 中的少一行时，需要更新父数据（删除当前条）
        else if (!selected && selectedIds?.length === childIdArr?.length - 1) {
            const parentKeys: React.Key[] = selectedKeys.filter((key: React.Key) => key !== parenRecord.id);
            const parentRows: any[] = selectRows.filter((item: any) => item.id !== parenRecord.id);
            setSelectedKeys(parentKeys);
            setSelectRows(parentRows);
            selectParams = {parent: {selectRows: parentRows, selectedKeys: parentKeys}};
        }
        //endregion
        setSelectChildRows(childRows);
        setSelectedChildKeys(childKeys);
        selectParams = {
            ...selectParams,
            child: {selectChildRows: childRows, selectedChildKeys: childKeys},
        };
        handleSetSelectVal(selectParams);
    }

    const expandedRowRender = (parenRecord: any) => {
        const rowSelectionChild = {
            columnWidth: 26,
            selectedRowKeys: selectedChildKeys,
            onSelect: (record: any, selected: boolean)=> onSelectChild(record, selected, parenRecord),
        };
        return <ProTable
            bordered
            rowKey={'id'}
            search={false}
            options={false}
            pagination={false}
            tableAlertRender={false}
            columns={expandedColumns}
            locale={{emptyText: 'No Data'}}
            rowSelection={rowSelectionChild}
            dataSource={parenRecord.child || []}
            style={{width: "calc(100% - 31px)", float: 'right'}}
        />;
    }
    //endregion

    return (
        <ProTable<any>
            bordered
            rowKey={'id'}
            size="middle"
            search={false}
            options={false}
            columns={columns}
            loading={loading}
            dateFormatter="string"
            tableAlertRender={false}
            rowSelection={rowSelection}
            dataSource={props.dataSource}
            locale={{emptyText: 'No Data'}}
            expandable={{expandedRowRender}}
            className={'antd-pro-table-expandable'}
        />
    )
}
export default ExpandTable;