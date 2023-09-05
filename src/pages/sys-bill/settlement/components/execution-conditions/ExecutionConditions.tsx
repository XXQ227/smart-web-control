import React from 'react';
import '@/global.less'
import {Button, Col, Row, Space} from 'antd'
import { UserOutlined, TransactionOutlined } from '@ant-design/icons';
import '../../style-bill.less';
import {IconFont} from '@/utils/units'

interface Props {
    validateData: any;
}

const ExecutionConditions: React.FC<Props> = (props) => {
    const {validateData} = props;

    return (
        <Row gutter={24} className={'ant-row-bill-execution-conditions'}>
            <Col span={24}>
                <Space>
                    <Button type="text" color={validateData.businessLine ? '#D39E59' : ''} icon={<UserOutlined/>}>
                        Business Line
                    </Button>
                    <Button type="text" color={validateData.customer ? '#D39E59' : ''} icon={<UserOutlined/>}>
                        Customer
                    </Button>
                    <Button type="text" color={validateData.exRate ? '#D39E59' : ''} icon={<IconFont type={'icon-ex-rate'}/>}>
                        Ex Rate
                    </Button>
                    <Button type="text" color={validateData.billCurrencyName ? '#D39E59' : ''} icon={<TransactionOutlined/>}>
                        Bill Currency
                    </Button>
                </Space>
            </Col>
        </Row>
    )
}

export default ExecutionConditions;