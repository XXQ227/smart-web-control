import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  // splitMenus: true ==> 把菜单栏设置成顶部；
  // 自动切割菜单是 mix 模式专属的能力，他可以把第一级的菜单放置到顶栏中。我们可以设置 splitMenus=true 来打开它，
  // 为了体验良好最好给每个一级菜单都设置一个重定向,这样可以防止切换到白屏页面。
  splitMenus: true,
  colorWeak: false,
  title: 'EHK',
  pwa: false,
  // pure: true,
  logo: '/logo.png',
  iconfontUrl: '',
  menu: {
    locale: true,
  }
};

export default Settings;
