/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { userInfo?: API.LoginUserInfo } | undefined) {
  const {userInfo} = initialState ?? {};
  // 先把 currentUser?.AuthorityIDList 转成数组<:string[]>；再把里面的数据转成<:number[]>,且做排序
  const authIDListStr = userInfo?.AuthorityIDList?.split(',') || [], authIDList: number[] = [];
  // 转成<int> 行
  authIDListStr?.map(x => authIDList.push(parseInt(x)));
  // 排序
  authIDList.sort((a, b) => a - b);

  return {
    isLeadAdmin: authIDList.includes(14),   // 超级管理员权限
    isJobEdit: authIDList.includes(2),      // 业务操作
    isJobCheck: authIDList.includes(3),     // 业务审批
  };
}
