import React from "react";
//redux
import { useSelector } from "react-redux";

//material-ui
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Spinner from "../util/spinner/spinner";
import SwipeableImages from "./SwipeableImages";

const useStyles = makeStyles({
  borderBottom: {
    borderBottom: "2px solid #000",
    position: "absolute",
    top: "25.5%",
    left: "6.5%",
    bottom: 0,
    height: "28%",
    width: "44%",
  },
  borderLeft: {
    borderLeft: "2px solid #000",
    position: "absolute",
    top: "25.5%",
    left: "6.5%",
    bottom: 0,
    height: "28%",
  },
  para: {
    fontSize: "1.2rem",
    // marginLeft: "32%",
  },
});

function Restaurant(props) {
  const classes = useStyles();
  const { loading } = useSelector((state) => state.data);
  const {
    name,
    imageUrl,
    tags,
    costForOne,
    minOrderAmount,
    payment,
    address,
    rating,
  } = props;
  let paymentString;
  let phoneNo;
  let addressString;
  let ratingString;

  if (address) {
    phoneNo = address.phoneNo;
    addressString = `${address.aptName}, ${address.locality}, ${address.street}`;
  }

  if (payment ? payment.length === 1 : null)
    paymentString = `Accepts ${payment[0].toLowerCase()} payment`;

  if (payment ? payment.length === 2 : null)
    paymentString = `Accepts ${payment[0].toLowerCase()} & ${payment[1].toLowerCase()} payments`;
  if(rating===0)
    ratingString = "No Reviews Yet";
  else 
    ratingString = `${Math.round(rating * 100)/100}/5`;
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Grid container direction="row">
            <Grid item xs={false} sm={1} />
            <Grid item xs={12} sm={6} style={{ marginTop: 120 }}>
              <Typography
                gutterBottom
                variant="h4"
                component="h2"
                style={{ fontStyle: "bold" }}
              >
                {name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" className={classes.para}>
                {tags}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" className={classes.para}>
                Costs Rs.{costForOne} for one
              </Typography>
              <Typography variant="body2" color="textPrimary" className={classes.para}>
                Minimum order Rs.{minOrderAmount}
              </Typography>
              <Typography variant="body2" color="textPrimary" className={classes.para}>
                {paymentString}
              </Typography>
              <br />
              <Typography variant="body2" color="textPrimary" className={classes.para}>
                Address: {addressString}
              </Typography>
              <Typography variant="body2" color="textPrimary" className={classes.para}>
                Call: +91 {phoneNo}
              </Typography>
              {/* <Typography variant="body2" color="textPrimary">
                Dine-In Timing: 1pm to 12am
              </Typography> */}
              <Typography variant="body2" color="textPrimary" className={classes.para}>
                Rating: {ratingString}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} style={{ marginTop: 34 }}>
              {imageUrl ? (
                <SwipeableImages images={imageUrl} type="restaurant" />
              ) : null}
            </Grid>
            <div className={classes.borderLeft}></div>
            <div className={classes.borderBottom}></div>
            <Grid item xs={false} sm={1} />
          </Grid>
        </>
      )}
    </>
  );
}

export default React.memo(Restaurant);
