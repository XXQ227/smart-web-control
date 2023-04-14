
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { userInfo?: API.LoginUserInfo, isJobEditPage: boolean } | undefined) {
  const {userInfo, isJobEditPage} = initialState ?? {};
  // 给权限数组排序
  const authIDList: any = userInfo?.AuthIDList?.sort((a: number, b: number) => a - b) || [];
  return {
    isLeadAdmin: authIDList.includes(14),   // 超级管理员权限
    isJobEdit: authIDList.includes(2),      // 业务操作
    isJobCheck: authIDList.includes(3),     // 业务审批
    isJobEditPage,     // 业务审批
  };
}
