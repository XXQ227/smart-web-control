import React, {Fragment, useEffect} from 'react';
import BasicInfo from '../job/basicInfo';
import Cargo from '../job/cargo';
import Payment from '../job/payment';

// const FormItem = Form.Item;
interface Props {
    CJobInfo: APIModel.NJobDetailDto,
    SalesManList: API.APIValue$Label[],
    FinanceDates: string[],
}

const Job: React.FC<Props> = (props) => {
    const  {
        CJobInfo,
        CJobInfo: {NBasicInfo, CargoInfo},
        SalesManList, FinanceDates
    } = props;

    useEffect(() => {

    }, [])
    //endregion

    // const baseParams: any = {form, FormItem};
    const basicInfoParams: any = {CJobInfo, NBasicInfo, SalesManList, FinanceDates};
    const cargoParams: any = {CargoInfo, NBasicInfo};

    return (
       <Fragment>
           <BasicInfo
               title={'Basic Information'}
               {...basicInfoParams}
           />
           <Cargo
               title={'Cargo'}
               {...cargoParams}
           />
           <Payment
               title={'Payment & Shipping Terms'}
               NBasicInfo={NBasicInfo}
           />
           <Payment
               title={'Remark'}
               NBasicInfo={NBasicInfo}
           />
       </Fragment>
    )
}
export default Job;