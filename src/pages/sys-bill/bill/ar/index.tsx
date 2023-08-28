import React, {useEffect, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard, ProTable} from '@ant-design/pro-components'
import '@/global.less'


const BillingAR: React.FC<RouteChildrenProps> = () => {

    // TODO: 父数据列数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    // TODO: 子单选中列数据
    const [selectedChildKeys, setSelectedChildKeys] = useState<React.Key[]>([]);
    const [selectChildRows, setSelectChildRows] = useState<any[]>([]);
    const [arList, setARList] = useState<any[]>([]);


    useEffect(()=> {
        if (arList?.length === 0) {
            const data: any[] = [];
            for (let i = 0; i < 3; i++) {
                const target: any = {
                    id: i, businessLine: 'FF', customerNameEn: 'China Duty Free INT\'LTD', jobCode: 'HKSE2212000' + i,
                    orderTakingDate: '2023-08-12', completionDate: '2023-08-12', creator: 'Vicky Lau',
                    salesName: 'Vincent Lam',
                    child: [],
                }
                for (let j = 0; j < 3; j++) {
                    const cgObj: any = {
                        id: `${i}-${j}`,
                        payerNameEn: 'China Duty Free INT\'LTD',
                        description: 'Freight Charge',
                        amount: 680,
                        currencyName: j < 2 ? 'HKD' : j > 4 ? 'USD' : 'CNY',
                        aBillCurrencyName: j <= 2 ? 'HKD' : j >= 4 ? 'USD' : 'CNY',
                        exRate: 1,
                        ABillAmount: 680,
                    }
                    target.child.push(cgObj);
                }
                data.push(target);
            }
            setARList(data);
        }
    }, [arList?.length])

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
        let cgIdArr: any[] = record.child?.map((item: any) => item.id) || [];
        let childKeys: React.Key[] = selectedChildKeys.slice(0),
            childRows: any[] = selectChildRows.slice(0);
        if (selected) {
            // TODO: 过滤被选中的费用 id
            cgIdArr = cgIdArr.filter((key: string) => !childKeys.includes(key));
            const cgRows: any[] = record.child.filter((item: any)=> cgIdArr.includes(item.id));
            // TODO: 选中添加 当前行的费用
            childKeys.push(...cgIdArr);
            childRows.push(...cgRows);
        } else {
            // TODO: 取消选中：删除当前行的费用
            childKeys = childKeys.filter((key: React.Key) => !cgIdArr.includes(key));
            childRows = childRows.filter((item: any) => !cgIdArr.includes(item.id));
        }
        setSelectedChildKeys(childKeys);
        setSelectChildRows(childRows);
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
            let cgIdArr: React.Key[] = [], childArr: any[] = [];
            if (selectedRow?.length > 0) {
                cgIdArr = selectedRow.map((item: any) => item.child?.map((cg: any) => cg.id)).flat();
                childArr = selectedRow.map((item: any) => item.child).flat();
            }
            // TODO: 选中添加 当前行的费用
            childKeys.push(...cgIdArr);
            childRows.push(...childArr);
        }
        setSelectedChildKeys(childKeys);
        setSelectChildRows(childRows);
    }

    const columns: ProColumns[] = [
        {title: 'B-Line', dataIndex: 'businessLine', key: 'businessLine', width: 60, align: 'center'},
        {title: 'Job No.', dataIndex: 'jobCode', key: 'jobCode', width: 150},
        {title: 'Customer', dataIndex: 'customerNameEn', key: 'customerNameEn',},
        {title: 'Taking Date', dataIndex: 'orderTakingDate', key: 'orderTakingDate', width: 120, align: 'center'},
        {title: 'Completion', dataIndex: 'completionDate', key: 'completionDate', width: 120, align: 'center'},
        {title: 'Creator', dataIndex: 'creator', key: 'creator', width: 150, align: 'center'},
        {title: 'Sales', dataIndex: 'salesName', key: 'salesName', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];
    const rowSelection = {
        columnWidth: 26,
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectedKeys(selectedRowKeys);
            setSelectRows(selectedRows);
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
     * @param cgRows    当前行父级数据
     * @returns
     */
    const onSelectChild = (record: any, selected: boolean, cgRows: any) => {
        let childKeys: React.Key[] = selectedChildKeys.slice(0);
        let childRows: any[] = selectChildRows.slice(0);
        // TODO: 选中一个，存一个；取消一个，则删除一个
        if (selected) {
            // TODO: 选中添加 当前行的费用
            childKeys.push(record.id);
            childRows.push(record);
        } else {
            // TODO: 取消选中：删除当前行的费用
            childKeys = childKeys.filter((key: React.Key) => key !== record.id);
            childRows = childRows.filter((item: any) => item.id !== record.id);
        }
        //region TODO: 以下判断是否需要选中父级数据
        // TODO: 获取当前 job 下所有费用条数
        const cgIdNumArr: React.Key[] = cgRows.child?.map((cg: any) => cg.id);
        // TODO: 找出当前 job 下的费用，在选中的费用行中有多少条
        const localJobCGs: React.Key[] = childKeys.filter((key: React.Key) => cgIdNumArr.includes(key));
        // TODO: 当选中的费用等于所有费用时，父级数据也一并被选中
        if (localJobCGs?.length === cgIdNumArr?.length) {
            const jobIds: any[] = selectedKeys.slice(0);
            const jobRows: any[] = selectRows.slice(0);
            jobIds.push(cgRows.id);
            jobRows.push(cgRows);
            setSelectedKeys(jobIds);
            setSelectRows(jobRows);
        }
        // TODO: 当是取消选中且选中的条数比 state 中的少一行时，需要更新父数据（删除当前条）
        else if (!selected && localJobCGs?.length === cgIdNumArr?.length - 1) {
            const jobIds: React.Key[] = selectedKeys.filter((key: React.Key) => key !== cgRows.id);
            const jobRows: any[] = selectRows.filter((item: any) => item.id !== cgRows.id);
            setSelectedKeys(jobIds);
            setSelectRows(jobRows);
        }
        //endregion
        setSelectedChildKeys(childKeys);
        setSelectChildRows(childRows);
    }

    const expandedRowRender = (cgRows: any) => {
        const columnsChild: ProColumns[] = [
            {title: 'Payer', dataIndex: 'payerNameEn', key: 'payerNameEn', align: 'left'},
            {title: 'Description', dataIndex: 'description', key: 'description', width: 200, align: 'left' },
            {title: 'Amount', dataIndex: 'amount', key: 'orderTakingDate', width: 120, align: 'center'},
            {title: 'CURR', dataIndex: 'currencyName', key: 'completionDate', width: 80, align: 'center'},
            {title: 'Bill CURR', dataIndex: 'aBillCurrencyName', key: 'creator', width: 80, align: 'center'},
            {title: 'Ex Rate', dataIndex: 'exRate', key: 'salesName', width: 100, align: 'center'},
            {title: 'Bill Amount', dataIndex: 'ABillAmount', key: 'salesName', width: 150, align: 'center'},
            {title: 'Action', key: 'action', width: 100},
        ];

        const rowSelectionChild = {
            columnWidth: 26,
            selectedRowKeys: selectedChildKeys,
            onSelect: (record: any, selected: boolean)=> onSelectChild(record, selected, cgRows),
        };
        return <ProTable
            bordered
            rowKey={'id'}
            search={false}
            options={false}
            pagination={false}
            columns={columnsChild}
            tableAlertRender={false}
            locale={{emptyText: 'No Data'}}
            rowSelection={rowSelectionChild}
            dataSource={cgRows.child || []}
            style={{width: "calc(100% - 31px)", float: 'right'}}
        />;
    }
    //endregion

    // console.log(
    //     'selectedKeys: ', selectedKeys, '\nselectRows: ', selectRows,
    //     '\nselectedChildKeys: ', selectedChildKeys, '\nselectChildRows: ', selectChildRows,
    // );
    console.log(selectedKeys, selectRows, selectedChildKeys, selectChildRows);

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard>
                <ProTable<any>
                    bordered
                    rowKey={'id'}
                    size="middle"
                    search={false}
                    options={false}
                    columns={columns}
                    dataSource={arList}
                    dateFormatter="string"
                    tableAlertRender={false}
                    rowSelection={rowSelection}
                    locale={{emptyText: 'No Data'}}
                    expandable={{expandedRowRender}}
                    className={'antd-pro-table-expandable'}
                />
            </ProCard>
        </PageContainer>
    )
}
export default BillingAR;