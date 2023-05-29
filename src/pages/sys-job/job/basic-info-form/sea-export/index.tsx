import React, {Fragment, useEffect} from 'react';
import Basic from "./basic";
import Pickup from "./pickup";
import Ports from "./port";

// const FormItem = Form.Item;
interface Props {
    Carrier?: APIModel.Carrier,
    HouseBill?: APIModel.HouseBill,
    Port?: APIModel.Port,
    NBasicInfo: APIModel.NBasicInfo,
}

const SeaExport: React.FC<Props> = (props) => {
    const  {
        Carrier, HouseBill,
        Port, NBasicInfo,
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

           {/* 提货信息 */}
           <Pickup
               title={'Pickup'}
               Carrier={Carrier}
           />

           {/* 港口信息 */}
           <Ports
               title={'Port'}
               Port={Port}
               NBasicInfo={NBasicInfo}
           />
       </Fragment>
    )
}
export default SeaExport;