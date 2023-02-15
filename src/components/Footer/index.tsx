import {GithubOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import {useIntl} from 'umi';
import styles from './footer.less';

const Footer: React.FC = () => {
    const intl = useIntl();
    const defaultMessage = intl.formatMessage({
        id: 'app.copyright.produced',
        defaultMessage: '香港控股IT技术中心出品',
    });

    const currentYear = new Date().getFullYear();


    return (
        <DefaultFooter
            className={styles.antd_pro_footer}
            copyright={`${currentYear} ${defaultMessage}`}
            links={[
                {
                    key: 'Smart',
                    title: 'Smart',
                    href: 'https://pro.ant.design',
                    blankTarget: true,
                },
                {
                    key: 'github',
                    title: <GithubOutlined/>,
                    href: 'https://github.com/ant-design/ant-design-pro',
                    blankTarget: true,
                },
                {
                    key: 'Smart System',
                    title: 'Smart System',
                    href: 'https://ant.design',
                    blankTarget: true,
                },
            ]}
        />
    );
};

export default Footer;
