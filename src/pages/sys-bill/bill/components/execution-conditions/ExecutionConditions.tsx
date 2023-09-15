import React from 'react';
import '@/global.less'
import {Button, Col, Row, Space} from 'antd'
import { UserOutlined, TransactionOutlined } from '@ant-design/icons';
import '../../style-bill.less';
import {IconFont} from '@/utils/units'

interface Props {
    validateData: any;
    hiddenState: any;
}

const ExecutionConditions: React.FC<Props> = (props) => {
    const {validateData, hiddenState: {hiddenBusinessLine, hiddenBusiness, hiddenExRate, hiddenBillCurrency}} = props;

    return (
        <Row gutter={24} className={'ant-row-bill-execution-conditions'}>
            <Col span={24}>
                <Space>
                    <Button
                        type="text" hidden={!!hiddenBusinessLine} color={validateData.businessLineState ? '#D39E59' : ''}
                        icon={<UserOutlined/>}
                    >Business Line</Button>
                    <Button
                        type="text" hidden={!!hiddenBusiness} color={validateData.customerState ? '#D39E59' : ''}
                        icon={<UserOutlined/>}
                    >Payer / Vendor</Button>
                    <Button
                        type="text" hidden={!!hiddenExRate} color={validateData.exRateState ? '#D39E59' : ''}
                        icon={<IconFont type={'icon-ex-rate'}/>}
                    >Ex Rate</Button>
                    <Button
                        type="text" hidden={!!hiddenBillCurrency} color={validateData.billCurrencyNameState ? '#D39E59' : ''}
                        icon={<TransactionOutlined/>}
                    >Bill Currency</Button>
                </Space>
            </Col>
        </Row>
    )
}

export default ExecutionConditions;