import React from "react";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import cover from "../images/homeTiffinPic.webp";

const useStyles = makeStyles((theme) => ({
  presentation: {
    display: "flex",
    width: "90%",
    margin: "auto",
    minHeight: "80vh",
    alignItems: "center",
    // eslint-disable-next-line
    ["@media (max-width:1024px)"]: {
      flexDirection: "column",
    },
  },
  introduction: {
    flex: 1,
    paddingLeft: 60,
    height: "340px",
  },
  safeFood: {
    fontSize: 64,
    fontWeight: 400,
  },
  delivery: {
    color: theme.palette.primary.main,
    fontSize: 64,
    fontWeight: "bold",
    marginTop: -30,
    marginBottom: 20,
  },
  paragraph: {
    width: 400,
    fontSize: 14.5,
  },
  cover: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    height: "72vh",
  },
  coverImg: {
    height: "100%"
  },
  ctaOrder: {
    fontSize: 18,
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginTop: 30,
  },
}));

const HomeStart = (props) => {
  const classes = useStyles();
  return (
    <section className={classes.presentation}>
      <div className={classes.introduction}>
        <Typography className={classes.safeFood} noWrap>
          Finding Tiffin Center
        </Typography>
        <Typography className={classes.delivery} noWrap>
          EASYYYY
        </Typography>
        <Typography variant="body2" className={classes.paragraph}>
          Through Tiffiny we are making your journey of finding a good, healthy tiffin center easier, effective and less time consuming.
        </Typography>
        <Button variant="outlined" className={classes.ctaOrder} onClick={props.handleClick}>
          ORDER NOW
        </Button>
      </div>
      <div className={classes.cover}>
        <img src={cover} alt="safe-delivery" className={classes.coverImg} />
      </div>
    </section>
  );
};

export default React.memo(HomeStart);
