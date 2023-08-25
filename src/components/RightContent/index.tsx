import {QuestionCircleOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import React from 'react';
import {/*SelectLang, */useModel} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import ChooseBranch from '@/components/ChooseBranch'
import type {RouteChildrenProps} from 'react-router'

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC<RouteChildrenProps> = (props) => {
    const {initialState} = useModel('@@initialState');

    if (!initialState || !initialState.settings) {
        return null;
    }

    const {navTheme, layout} = initialState.settings;
    let className = styles.right;

    if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
        className = `${styles.right}  ${styles.dark}`;
    }
    return (
        <Space className={className}>

            {/* 选择 branch */}
            <ChooseBranch {...props}/>

            {/*<HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                defaultValue="umi ui"
                options={[
                    {label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui'},
                    {
                        label: <a href="next.ant.design">Ant Design</a>,
                        value: 'Ant Design',
                    },
                    {
                        label: <a href="https://protable.ant.design/">Pro Table</a>,
                        value: 'Pro Table',
                    },
                    {
                        label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
                        value: 'Pro Layout',
                    },
                ]}
                // onSearch={value => {
                //   console.log('input', value);
                // }}
            />*/}

            <span
                className={styles.action}
                onClick={() => {
                    // window.open('https://pro.ant.design/docs/getting-started');
                    alert(' 问题 <可换成通知> ');
                }}
            >
                <QuestionCircleOutlined/>
            </span>

            {/* 个人信息 */}
            <Avatar/>

            {/* 多语言 */}
            {/*<SelectLang className={styles.action}/>*/}
        </Space>
    );
};
export default GlobalHeaderRight;
