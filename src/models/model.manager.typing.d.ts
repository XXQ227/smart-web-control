
declare namespace APIModel {
    //region TODO:  结算对象
    // TODO: 结算对象搜索参数
    type CVSearchParams = {
        current?: number,
        PageNum?: 1 | number,
        OracleID?: string,
        OracleIDSupplier?: string,
        CustomerUBSID?: string,
        SupplierUBSID?: string,
        TaxNum?: string,
        CTName?: string,
        PageSize?: 15 | number,
        CTType?: 1 | number,
        UserID?: number,
    }
    type CVResultInfo = {
        data?: CVInfoList[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type CVInfoList = {

    }
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion

    //region TODO:
    //endregion
}