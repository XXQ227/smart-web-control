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
                    <Button type="text" icon={<UserOutlined color={validateData.businessLine ? '#D39E59' : ''} />}>
                        Business Line
                    </Button>
                    <Button type="text" icon={<UserOutlined color={validateData.customer ? '#D39E59' : ''} />}>
                        Customer
                    </Button>
                    <Button type="text" icon={<IconFont type={'icon-ex-rate'} color={validateData.exRate ? '#D39E59' : ''} />}>
                        Ex Rate
                    </Button>
                    <Button type="text" icon={<TransactionOutlined color={validateData.billCurrencyName ? '#D39E59' : ''} />}>
                        Bill Currency
                    </Button>
                </Space>
            </Col>
        </Row>
    )
}

export default ExecutionConditions;