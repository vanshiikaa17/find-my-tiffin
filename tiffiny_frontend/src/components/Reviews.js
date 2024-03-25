import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//material-ui
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Button } from "@material-ui/core";

//custom-hook
import useForm from "../hooks/forms";

import ReviewDialog from "./ReviewDialog";
import { addReview } from "../redux/actions/dataActions";
const useStyles = makeStyles({
  para: {
    fontSize: "x-large",
    marginLeft: "32%",
  },
  paraSeller: {
    fontSize: "x-large",
    marginLeft: "28%",
  },
});

function Reviews(props) {
  const [open, setOpen] = useState(false);
  const { inputs, handleInputChange } = useForm({
    title: "",
    description: "",
    rating: "",
  });
  const classes = useStyles();
  const { reviews } = props;
  const dispatch = useDispatch();
  // const {
  //   account: { role },
  // } = useSelector((state) => state.auth);
  const handleOpen = () => {
    setOpen(true);
  };
  const { _id:sellerId } = useSelector((state) => state.data.restaurant);
  const { _id:userId } = useSelector((state) => state.auth.account);
  const handleClose = () => {
    inputs.title = "";
    inputs.description = "";
    inputs.rating = "";
    setOpen(false);
  };

  const handleSubmit = () => {
    const reviewData = new FormData();
    reviewData.append("title", inputs.title);
    reviewData.append("description", inputs.description);
    reviewData.append("rating", inputs.rating);
    reviewData.append("sellerId",sellerId);
    reviewData.append("userId",userId);
    dispatch(addReview(reviewData)); // eslint-disable-next-line
    handleClose();
  };

  return (
  <>
    {!props.isSeller&&<>
      <Button className={classes.button} onClick={handleOpen} style={{margin: '0 auto', display: "flex"}}>
        Write Your Review
      </Button>
      <ReviewDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        inputs={inputs}
        handleInputChange={handleInputChange}
      />
    </>}
    <List style={{margin: '0 auto', display: "flex", flexDirection: "column"}}>
        {reviews ? (
          reviews.length > 0 ? (
            reviews.map((item) => (
              <>
                <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${item.title} ${item.rating}/5`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.description}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
            ))
          ) : (
            <p className={classes.para}>
              No Reviews present currently.
            </p>
          )
        ) : <p className={classes.para}>
          No Reviews present currently.
        </p>}
    </List>
  </>
  );
}

export default React.memo(Reviews);
