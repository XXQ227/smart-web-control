
declare namespace API {
    type GetCJobListInfo = {
        Key: string,
        AuthorityType: number,
        TimeLimitType?: number,
        TabID: number,
        UserID: number,
        IsClickSearch: boolean,
        PageNum: number,
        PageSize: number,
    };

    type CJobListItem  = {
        ID: number,
        Code: string,
        PrincipalNameEN: string,
        POLETA: string,
        ETD: string,
        ATD: string,
        ETA: string,
        MBOLNum: string,
        FreighterEN: string,
        state: string,
    }

    type ResCJob = {
        CJobList: CJobListItem[] | [];

    }

    // TODO: 单票列表结果集
    type APIGetCJobListResult = {
        Divisions?: any;
        FinanceDates?: any;
        JobDto?: {
            Result?: boolean;
            Page?: APIPage;
            Content?: {
                CJobList?: CJobListItem[],
                AllFinishQty: number,
                BizFinishQty: number,
                FinishQty: number,
                OnWayNewQty: number,
                OnWayQty: number,
                PendingQty: number,
                SetFinishQty: number,
                ShutoutQty: number,
            };
        };
    };

    type RuleCJobList = {
        data?: CJobListItem[] | [];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

}