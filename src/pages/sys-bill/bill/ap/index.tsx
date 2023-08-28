import React, {useEffect, useState} from 'react';
import type { RouteChildrenProps } from 'react-router';
import type { ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProCard} from '@ant-design/pro-components'
import '@/global.less'
import ExpandTable from '@/components/ExpandTable'
import {Col, Row} from 'antd'
import ExecutionConditions from '@/pages/sys-bill/bill/components/execution-conditions/ExecutionConditions'


const BillingAP: React.FC<RouteChildrenProps> = () => {

    // TODO: 父数据列数据
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    // TODO: 子单选中列数据
    const [selectedChildKeys, setSelectedChildKeys] = useState<React.Key[]>([]);
    const [selectChildRows, setSelectChildRows] = useState<any[]>([]);
    const [aList, setAPList] = useState<any[]>([]);

    console.log(selectedKeys, selectRows, selectedChildKeys, selectChildRows);

    useEffect(()=> {
        if (aList?.length === 0) {
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
            setAPList(data);
        }
    }, [aList?.length])


    /**
     * @Description: TODO: table 复选框数据处理方法
     * @author XXQ
     * @date 2023/8/25
     * @param params    选中的费用数据
     * @returns
     */
    function handleSetSelectVal(params: any) {
        for (const key in params) {
            // 防止遍历到原型链上的属性
            if (params.hasOwnProperty(key)) {
                console.log(key);
                const obj: any = params[key] || {};
                if (key === 'child') {
                    if (obj.selectChildRows) setSelectChildRows(obj.selectChildRows);
                    if (obj.selectedChildKeys) setSelectedChildKeys(obj.selectedChildKeys);
                } else {
                    if (obj.selectRows) setSelectRows(obj.selectRows);
                    if (obj.selectedKeys) setSelectedKeys(obj.selectedKeys);
                }
            }
        }
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

    const expandedColumns: ProColumns[] = [
        {title: 'Payer', dataIndex: 'payerNameEn', key: 'payerNameEn', align: 'left'},
        {title: 'Description', dataIndex: 'description', key: 'description', width: 200, align: 'left' },
        {title: 'Amount', dataIndex: 'amount', key: 'orderTakingDate', width: 120, align: 'center'},
        {title: 'CURR', dataIndex: 'currencyName', key: 'completionDate', width: 80, align: 'center'},
        {title: 'Bill CURR', dataIndex: 'aBillCurrencyName', key: 'creator', width: 80, align: 'center'},
        {title: 'Ex Rate', dataIndex: 'exRate', key: 'salesName', width: 100, align: 'center'},
        {title: 'Bill Amount', dataIndex: 'ABillAmount', key: 'salesName', width: 150, align: 'center'},
        {title: 'Action', key: 'action', width: 100},
    ];


    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard title={''}>
                <Row gutter={24}>
                    <Col span={24}>
                        <ExecutionConditions validateData={{}} />
                    </Col>
                </Row>
                <ExpandTable
                    columns={columns}
                    expandedColumns={expandedColumns}
                    dataSource={aList}
                    handleSetSelectVal={handleSetSelectVal}
                />
            </ProCard>
        </PageContainer>
    )
}
export default BillingAP;