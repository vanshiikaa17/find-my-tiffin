import React from "react";
import { useSelector } from "react-redux";

import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  button: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "40%",
    margin: "40px 0 0 30%",
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
}));

export default function ReviewDialog(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    handleSubmit,
    inputs,
    handleInputChange,
  } = props;
  const { errors } = useSelector((state) => state.UI);

  const { message, errors: errorsItem } = errors || {};

  let titleError;
  let descError;
  let ratingError;

  if (errorsItem) {
    for (let error of errorsItem) {
      if (error.msg.includes("Title needs to be")) titleError = error.msg;
      if (error.msg.includes("Description cannot")) descError = error.msg;
      if (error.msg.includes("rating cannot")) ratingError = error.msg;
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Enter details</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            name="title"
            label="Title"
            placeholder="Title of your review"
            className={classes.textField}
            value={inputs.title}
            onChange={handleInputChange}
            helperText={titleError}
            error={titleError ? true : false}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            placeholder="Detailed Description regarding the review"
            className={classes.textField}
            value={inputs.description}
            onChange={handleInputChange}
            helperText={descError}
            error={descError ? true : false}
            fullWidth
          />
          <TextField
            name="rating"
            label="Rating"
            placeholder="Rating of the food"
            className={classes.textField}
            type="number"
            value={inputs.rating}
            onChange={handleInputChange}
            helperText={ratingError}
            error={ratingError ? true : false}
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ color: "#c70f02" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
