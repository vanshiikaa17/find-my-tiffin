import React from "react";
import {BsFillCreditCard2FrontFill} from "react-icons/bs";
import {MdDateRange, MdVpnKey} from "react-icons/md";
import {CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements} from "@stripe/react-stripe-js"
import makeStyles from "@material-ui/core/styles/makeStyles";
const useStyles = makeStyles((theme) => ({
    ...theme.spreadThis,
})
);
const Payment=()=>{
    const stripe=useStripe();
    const elements=useElements();

return(
    <>
    <div className="paymentContainer">
            <form className='paymentForm'>
                <h2>Card Details</h2>
                <div className='paymentDiv'>
                    <BsFillCreditCard2FrontFill/>
                    <CardNumberElement className='paymentInput'/>
                </div>
                <div className='paymentDiv'>
                    <MdDateRange/>
                    <CardExpiryElement className='paymentInput'/>
                </div>
                <div className='paymentDiv'>
                    <MdVpnKey/>
                    <CardCvcElement className='paymentInput'/>
                </div>

                <input
                type="submit"
                value={`Pay `}
                // ref={paymentBtn}
                className="paymentButton"/>
            </form>

        </div>
    </>
)
}
export default Payment;