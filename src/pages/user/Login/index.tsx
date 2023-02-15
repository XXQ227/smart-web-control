import Footer from '@/components/Footer';
import {getFakeCaptcha} from '@/services/ant-design-pro/login';
import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Alert, message, Tabs} from 'antd';
import React, {useState} from 'react';
import {FormattedMessage, history, SelectLang, useIntl, useModel} from 'umi';
import styles from './index.less';

const LoginMessage: React.FC<{
    content: string;
}> = ({content}) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);

const Login: React.FC = () => {
    // tab 切换
    const [type, setType] = useState<string>('account');
    const [status, setStatus] = useState<string>('');

    // 使用 models/user
    const users = useModel('users');

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    const handleSubmit = async (values: API.LoginParams) => {
        try {
            // 登录
            values.SystemID = 4;
            const result = await users.login(values) || {Result: false};
            // 登录成功
            if (result.Result) {
                message.success(intl.formatMessage({id: 'pages.login.success', defaultMessage: '登录成功！'}));
                setStatus('');

                /** 此方法会跳转到 redirect 参数所在的位置 */
                if (!history) return;
                history.push('/welcome');
                return;
            } else {
                message.error(intl.formatMessage({id: 'pages.login.failure', defaultMessage: '登录失败，请重试！'}));
                setStatus('error');
            }
            // 如果失败去设置用户错误信息
            // setUserLoginState(msg);
        } catch (error) {
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: '登录失败，请重试！',
            });
            message.error(defaultLoginFailureMessage);
        }
    };

    /**
     * @Description: Tabs 标签切换事件
     * @author XXQ
     * @date 2022/12/15
     * @param activeKey
     * @returns
     */
    const handleChangeTab = (activeKey: string) => {
        setType(activeKey);
        setStatus('');
    }

    // 登陆的 tab 切换
    const tabItem = [
        {key: "account", label: intl.formatMessage({id: 'pages.login.accountLogin.tab', defaultMessage: '账户密码登录'})},
        {key: "mobile", label: intl.formatMessage({id: 'pages.login.phoneLogin.tab', defaultMessage: '手机号登录'})},
    ];

    return (
        <div className={styles.container}>
            <div className={styles.lang} data-lang>
                {SelectLang && <SelectLang/>}
            </div>
            <div className={styles.content}>
                <LoginForm
                    logo={<img alt="logo" src="/logo.svg"/>}
                    title="Ant Design"
                    subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}
                    initialValues={{
                        autoLogin: true,
                    }}
                    actions={[
                        <FormattedMessage
                            key="loginWith"
                            id="pages.login.loginWith"
                            defaultMessage="其他登录方式"
                        />,
                        <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon}/>,
                        <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon}/>,
                        <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon}/>,
                    ]}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs activeKey={type} onChange={handleChangeTab} items={tabItem}/>
                    {type === 'account' ? (
                        <>
                            {status === 'error' && (
                                <LoginMessage
                                    content={intl.formatMessage({
                                        id: 'pages.login.accountLogin.errorMessage',
                                        defaultMessage: '账户或密码错误(admin/ant.design)',
                                    })}
                                />
                            )}
                            <ProFormText
                                // name="username"
                                name="LoginName"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.username.placeholder',
                                    defaultMessage: '用户名: admin or user',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.username.required"
                                                defaultMessage="请输入用户名!"
                                            />
                                        ),
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                // name="password"
                                name="Password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.password.placeholder',
                                    defaultMessage: '密码: ant.design',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.password.required"
                                                defaultMessage="请输入密码！"
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <>
                            {status === 'error' && <LoginMessage content="验证码错误"/>}
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={styles.prefixIcon}/>,
                                }}
                                name="mobile"
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.phoneNumber.placeholder',
                                    defaultMessage: '手机号',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.phoneNumber.required"
                                                defaultMessage="请输入手机号！"
                                            />
                                        ),
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.phoneNumber.invalid"
                                                defaultMessage="手机号格式错误！"
                                            />
                                        ),
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon}/>,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.captcha.placeholder',
                                    defaultMessage: '请输入验证码',
                                })}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${intl.formatMessage({
                                            id: 'pages.getCaptchaSecondText',
                                            defaultMessage: '获取验证码',
                                        })}`;
                                    }
                                    return intl.formatMessage({
                                        id: 'pages.login.phoneLogin.getVerificationCode',
                                        defaultMessage: '获取验证码',
                                    });
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.captcha.required"
                                                defaultMessage="请输入验证码！"
                                            />
                                        ),
                                    },
                                ]}
                                onGetCaptcha={async (phone) => {
                                    const result = await getFakeCaptcha({
                                        phone,
                                    });
                                    if (!result) {
                                        return;
                                    }
                                    message.success('获取验证码成功！验证码为：1234');
                                }}
                            />
                        </>
                    )}
                    <div style={{marginBottom: 24}}>
                        <ProFormCheckbox noStyle name="autoLogin">
                            <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
                        </ProFormCheckbox>
                        <a style={{float: 'right'}}>
                            <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>
                        </a>
                    </div>
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};

export default Login;
