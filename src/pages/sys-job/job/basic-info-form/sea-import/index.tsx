import React, {Fragment, useEffect} from 'react';
import Payment from '../job/payment';

// const FormItem = Form.Item;
interface Props {
    CJobInfo: APIModel.NJobDetailDto,
    SalesManList: API.APIValue$Label[],
    FinanceDates: string[],
}

const SeaImport: React.FC<Props> = (props) => {
    const  {
        CJobInfo: {NBasicInfo}
    } = props;

    useEffect(() => {

    }, [])
    //endregion

    return (
       <Fragment>
           <Payment
               title={'Remark'}
               NBasicInfo={NBasicInfo}
           />
       </Fragment>
    )
}
export default SeaImport;