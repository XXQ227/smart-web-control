import {PageContainer, ProCard} from '@ant-design/pro-components';
import {Alert, Card} from 'antd';
import React from 'react';
import {useIntl} from 'umi';

const Welcome: React.FC = () => {
    const intl = useIntl();


    return (
        <PageContainer>
            <Card>
                <Alert
                    message={intl.formatMessage({
                        id: 'pages.welcome.useSmartSystem',
                        defaultMessage: '欢迎使用 EHK 系统',
                    })}
                    type="success"
                    showIcon
                    banner
                    style={{
                        margin: -12,
                        marginBottom: 24,
                    }}
                />
            </Card>
            <ProCard className={'ant-card'}>
                test
            </ProCard>
        </PageContainer>
    );
};

export default Welcome;
