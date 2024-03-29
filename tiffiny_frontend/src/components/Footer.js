import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "black",
    color:"white",
    marginTop: "15rem",
    height: "42vh",
    textAlign: "center",
  },
  innerCont: {
    margin: "74px 40px 40px 40px",
  },
  resources: {
    margin: "60px 40px 10px 40px",
  },
  buttonStyleOne: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
  buttonStyleTwo: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginLeft: 10,
    marginTop: 8,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
  businessdiv:{
    display:"flex",
    alignItems:"center",
    flexDirection:"column",
    justifyContent:"center"
  }
}));

export default function Footer() {
  const { authenticated } = useSelector((state) => state.auth);
  const classes = useStyles();
  return (
    <div id="footer">
      <Grid container direction="row" className={classes.container} >
      <Grid item xs={12} sm={3} className={classes.innerCont}>
        {/* <Typography variant="h5" component="p">
          Tiffiny NewsLetter
          </Typography>
          <Typography variant="body1" component="p" style={{ marginBottom: 28 }}>
          Stay updated with new offers from Tiffiny
          </Typography>
          <TextField label="Your Email address" variant="outlined" style={{backgroundColor:"white"}} />
        <Button className={classes.buttonStyleTwo}>SEND</Button> */}
      </Grid>
        <Grid item xs={12} sm={4} className={classes.innerCont}>
          {authenticated ? (
            <Grid container direction="row">
              <Grid item xs={12} sm={6}>
                <Typography variant="h5" component="p">
                  Company
                </Typography>
                <Typography variant="body1" component="p">
                  <br />
                  - About <br />
                  - Blog <br />
                  - Careers <br />
                  - Contact <br />
                  - Report Fraud <br />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h5" component="p">
                  For You
                </Typography>
                <Typography variant="body1" component="p">
                  <br />
                  - Privacy <br />
                  - Terms <br />
                  - Security <br />
                  - Sitemap <br />
                  - Code of conduct <br />
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <div className={classes.businessdiv}>
              <Typography variant="h4" component="p">
                Tiffiny for Business
              </Typography>
              <Typography variant="body1" component="p">
                Get more out of your business, without losing focus on what is
                most important — delighting your customers
              </Typography>
              <br />
              <Link to="/addtiffincenter">
                <Button className={classes.buttonStyleOne}>Get Started</Button>
              </Link>
            </div>
          )}
        </Grid>
      {/* <Grid item xs={12} sm={3} className={classes.resources}>
        <Typography variant="h5" component="p">
          Resources/Stack Used
        </Typography>
        <Typography variant="body1" component="p" style={{ marginBottom: 28 }}>
          - React Material UI Redux
          <br />
          - NodeJs <br />
          - Express <br />
          - MongoDB <br />
          - Google Geolocation <br />
        </Typography>
      </Grid> */}
    </Grid>
    </div>
  );
}
