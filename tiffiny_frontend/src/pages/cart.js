import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { getCart, fetchAddress } from "../redux/actions/dataActions";
import Spinner from "../util/spinner/spinner";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import MyButton from "../util/MyButton";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//custom-hook
import useForm from "../hooks/forms";

import CartItem from "../components/CartItem";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Payment from "../components/Payment";

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  title: {
    margin: "20px 0px 20px 50px",
    display: "inline-block",
    // marginRight: "40%",
  },
  spaceTypo: {
    display: "flex",
    justifyContent: "space-between",
  },
  address: {
    "& > *": {
      margin: theme.spacing(4),
      width: "25ch",
    },
  },
  checkoutButton: {
    backgroundColor: "#1266f1",
    color: "white",
    marginBottom: 20,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
    "&:disabled": {
      color: "#bfbfbf",
    },

  },
  emptyCart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontSize: "2rem",
    height: "30rem"


  },
  step: {
    color: "#f44336",
   
  },
  MuiFormLabelAsterisk:{
    color:"black"

  },
  link: {
    textDecoration: "none",
    /* color: rgb(46, 46, 46); */
    color: "green",
    // font: 1.2rem "Poppins";
    transition: "ease 0.5s",
    "&:hover": {
      color: "rgb(26, 204, 26)",
    },
  },
  drpbtn:{
    backgroundColor:  theme.palette.primary.main,
    margin:"2rem 0",
    "&:hover": {
      backgroundColor: "#5a5c5a",
      color:"white"
    },
    
  },
  form:{
    margin:"2rem 0",

  }

}));

const Cart = (props) => {
  const [step, setStep] = useState(1);
  const [days, setDays] = React.useState(1);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { loading, cart, price } = useSelector((state) => state.data);
  const { errors } = useSelector((state) => state.UI);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});
  const [deliveryCharge, setDeliveryCharge] = React.useState(20);
  let cartPresent = Array.isArray(cart) && cart.length > 0;
  let cartItems = cartPresent ? cart.length : 0;

  let streetError = null;
  let aptError = null;
  let localityError = null;
  let zipError = null;
  let phoneNoError = null;

  const handlePlaceOrder = () => {
    const userData = {
      street: inputs.street,
      aptName: inputs.aptName,
      locality: inputs.locality,
      zip: inputs.zip,
      phoneNo: inputs.phoneNo,
      date: dateRange
    };
    dispatch(fetchAddress(userData, history));
  };


  const toggle = () => setOpen(!open);
  const updateDateRange = (range) => {
    setDateRange(range);
    const noOfDays = (range.startDate ? (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 3600 * 24) + 1 : 1);
    if (noOfDays >= 7) {
      setDeliveryCharge(0);
    } else {
      setDeliveryCharge(20);
    }
  };

  const { inputs, handleInputChange } = useForm({
    street:
      props.location.state.address != null &&
        // eslint-disable-next-line
        props.location.state.address != undefined
        ? props.location.state.address.street
        : "",
    locality:
      props.location.state.address != null &&
        // eslint-disable-next-line
        props.location.state.address != undefined
        ? props.location.state.address.locality
        : "",
    aptName:
      props.location.state.address != null &&
        // eslint-disable-next-line
        props.location.state.address != undefined
        ? props.location.state.address.aptName
        : "",
    zip:
      props.location.state.address != null &&
        // eslint-disable-next-line
        props.location.state.address != undefined
        ? props.location.state.address.zip
        : "",
    phoneNo:
      props.location.state.address != null &&
        // eslint-disable-next-line
        props.location.state.address != undefined
        ? props.location.state.address.phoneNo
        : "",
  });

  useEffect(() => {
    console.log("in useEffect cart");
    console.log("Step=" + step);
    dispatch(getCart());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
    console.log("step++ =" + step);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
    console.log("step--=" + step);

  };

  if (errors) {
    for (let error of errors) {
      if (error.msg.includes("10 digit phone")) phoneNoError = error.msg;
      if (error.msg.includes("Zipcode cannot")) zipError = error.msg;
      if (error.msg.includes("Locality cannot")) localityError = error.msg;
      if (error.msg.includes("Apartment name cannot")) aptError = error.msg;
      if (error.msg.includes("Street cannot")) streetError = error.msg;
    }
  }
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* <p>{step}</p> */}
          <Typography variant="h5" className={classes.title}>
            {step === 1 && `Cart (${cartItems} Items)`}
            {/* {step === 2 && "Delivery Details"} */}
          </Typography>
          {/* {step === 2 && (
            <MyButton tip="Go Back" onClick={prevStep}>
              <KeyboardBackspaceIcon />
            </MyButton>
          )} */}
          {cartItems === 0 &&
            <div className={classes.emptyCart}>

              <p>Cart is empty...</p>
              <Link to="./" className={classes.link}>Browse Tiffin Centers </Link>
            </div>}
          <Grid container direction="row" spacing={2}>
            <Grid item sm={1} />
            <Grid item sm={7}>
              {cartPresent &&
                step === 1 &&
                cart.map((item) => (
                  <CartItem {...item} key={item.itemId._id} />
                ))}
              {/* {step === 2 && (
                <>
                
                  
                    <Typography
                      variant="body2"
                      component="p"
                      style={{ margin: "10px 10px 2px 10px" }}
                    >
                      Address:
                    </Typography>
                  <form>

                    <div className={classes.address}>
                      <TextField
                        id="aptName"
                        name="aptName"
                        label="Flat/Apartment Name"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.aptName}
                        helperText={aptError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="locality"
                        name="locality"
                        label="Locality"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.locality}
                        helperText={localityError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="street"
                        name="street"
                        label="Street"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.street}
                        helperText={streetError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="zipCode"
                        name="zip"
                        label="Zip Code"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.zip}
                        helperText={zipError}
                        error={aptError ? "true" : "false"}
                        type="number"
                        //fullwidth
                        required
                      />
                      <TextField
                        id="phoneNo"
                        name="phoneNo"
                        label="Contact Number"
                        className={classes.textField}
                        type="number"
                        onChange={handleInputChange}
                        value={inputs.phoneNo}
                        helperText={phoneNoError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                    </div>
                  </form>
                  <Typography variant="h5" >
                    Select Date
                  </Typography>
                  <DateRangePicker
                    open={true}
                    onChange={(range) => updateDateRange(range)}
                  />
                </>
              )} */}

              {/* //************************* */}
              {step === 2 && (

                <>
                  <div>
                    <MyButton tip="Go Back" onClick={prevStep} style={{margin:"0 !important"}}>

                      <KeyboardBackspaceIcon />
                    </MyButton>
                  </div>
                  <Typography variant="h5" className={classes.title} style={{marginLeft:0}}>Delivery Details</Typography>

                  <Typography className={classes.step}>Please first enter your delivery details and then select the duration of your tiffin service subsription.</Typography>



                  <form className={classes.form}>

                    <div className={classes.address}>
                      <TextField
                        id="aptName"
                        name="aptName"
                        label="Flat/Apartment Name"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.aptName}
                        helperText={aptError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="locality"
                        name="locality"
                        label="Locality"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.locality}
                        helperText={localityError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="street"
                        name="street"
                        label="Street"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.street}
                        helperText={streetError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                      <TextField
                        id="zipCode"
                        name="zip"
                        label="Zip Code"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.zip}
                        helperText={zipError}
                        error={aptError ? "true" : "false"}
                        type="number"
                        //fullwidth
                        required
                      />
                      <TextField
                        id="phoneNo"
                        name="phoneNo"
                        label="Contact Number"
                        className={classes.textField}
                        type="number"
                        onChange={handleInputChange}
                        value={inputs.phoneNo}
                        helperText={phoneNoError}
                        error={aptError ? "true" : "false"}
                        //fullwidth
                        required
                      />
                    </div>
                    <Button onClick={toggle} className={classes.drpbtn}>
                      Click here to select the subscription duration
                    </Button>
                    <DateRangePicker
                      open={open}
                      toggle={toggle}
                      onChange={updateDateRange}
                    />
                  </form>
                </>
              )}
            </Grid>
            {cartItems !== 0 &&
              <Grid item sm={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#faf7f7" }}
                  elevation={4}
                >
                  <div style={{ marginLeft: 20, marginRight: 20 }}>
                    <br />
                    <Typography gutterBottom variant="h5" noWrap>
                      {step === 1 && "Total Amount"}
                      {step === 2 && "Order Summary"}
                      <br />
                      <br />
                    </Typography>
                    {step === 1 && (
                      <Typography variant="body2" color="textPrimary">
                        <div className={classes.spaceTypo}>
                          <span>Initial amount</span>
                          <span>Rs. {price}</span>
                        </div>
                        <br />
                        <br />
                        <div className={classes.spaceTypo}>
                          <span>Delivery Charge</span>
                          <span>Rs. {deliveryCharge}</span>
                        </div>
                        <div>(Not applicable for 7 Days plus orders)</div>
                        <br />
                      </Typography>
                    )}
                    {step === 2 &&
                      <>

                        {
                          cart.map((item) => {
                            return (
                              <Typography
                                variant="body2"
                                color="textPrimary"
                                key={item.itemId._id}
                              >
                                <div className={classes.spaceTypo}>
                                  <span>{item.itemId.title}</span>
                                  <span>
                                    Rs.
                                    {item.itemId.price} x {item.quantity} x {dateRange.startDate ? (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 3600 * 24) + 1 : 1}
                                  </span>
                                </div>
                                <br />
                              </Typography>
                            );
                          })
                        }

                        <div className={classes.spaceTypo}>

                          <span>Delivery Charge</span>
                          <span>Rs. {deliveryCharge} x {dateRange.startDate ? (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 3600 * 24) + 1 : 1}</span>
                        </div>
                        <Payment/>
                      </>
                    }
                    <hr />
                    <Typography gutterBottom variant="h5" noWrap>
                      <div className={classes.spaceTypo}>
                        <span>Grand Total</span>
                        <span>Rs. {(price + deliveryCharge) * (dateRange.startDate ? (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 3600 * 24) + 1 : 1)}</span>
                      </div>
                      <br />
                    </Typography>
                    {step === 1 && (
                      <Button
                        //fullwidth
                        className={classes.checkoutButton}
                        disabled={price === 0}
                        onClick={nextStep}
                      >
                        Proceed to Checkout
                      </Button>
                    )}
                    {step === 2 && (
                      <Button
                        //fullwidth
                        className={classes.checkoutButton}
                        onClick={handlePlaceOrder}
                      >
                        Place Order
                      </Button>
                    )}
                  </div>
                </Paper>
              </Grid>
            }
            <Grid item sm={1} />
          </Grid>

        </>
      )}
    </>
  );
};

export default Cart;
