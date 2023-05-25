import React, {Fragment, useEffect} from 'react';
import BasicInfo from '../job/basic-info';
import Cargo from '../job/cargo';
import Payment from '../job/payment';
import Basic from "@/pages/sys-job/job/basic-info-form/sea-export/basic";

// const FormItem = Form.Item;
interface Props {
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
}

const SeaExport: React.FC<Props> = (props) => {
    const  {
        Carrier, HouseBill
    } = props;

    useEffect(() => {

    }, [])
    //endregion

    return (
       <Fragment>
           <Basic
               title={'Basic'}
               Carrier={Carrier}
               HouseBill={HouseBill}
           />
       </Fragment>
    )
}
export default SeaExport;