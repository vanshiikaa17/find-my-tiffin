import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//custom-hook
import useForm from "../hooks/forms";

import ItemDialog from "../components/ItemDialog";
import RestaurantInfo from "../components/RestaurantInfo";
import RestaurantItems from "../components/RestaurantItems";
import SearchBar from "../components/SearchBar";
import { addItem } from "../redux/actions/dataActions";
import Reviews from "../components/Reviews";
const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  button: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "20%",
    margin: "2rem 0",
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
  searchArea:{
    display:"flex",
    alignItems:"center",
    flexDirection:"column",
    justifyContent:"center",
    margin: "4rem 0",
  }
}));

export default function SellerDashboard() {
  const { reviews } = useSelector((state) => state.data.restaurant);
  const classes = useStyles();
  const sellerData = useSelector((state) => state.auth);
  const { items } = sellerData;
  const dispatch = useDispatch();

  useEffect(() => {
    if (items) {
      setItemsState(items);
      setFilteredItemsState(items);
    }
  }, [items]);

  const [itemsState, setItemsState] = useState(items ? [] : null);
  const [filteredItemsState, setFilteredItemsState] = useState(
    items ? [] : null
  );
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState({});
  const { inputs, handleInputChange } = useForm({
    title: "",
    description: "",
    price: "",
  });

  const handleFileSelect = (event) => {
    setImage(event.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    inputs.title = "";
    inputs.description = "";
    inputs.price = "";
    setImage(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    const itemData = new FormData();
    itemData.append("image", image);
    itemData.append("title", inputs.title);
    itemData.append("description", inputs.description);
    itemData.append("price", inputs.price);
    dispatch(addItem(itemData)); // eslint-disable-next-line
    handleClose();
  };

  const handleSearch = (value) => {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (value !== "") {
      // Assign the original list to currentList
      currentList = itemsState;

      newList = currentList.filter((item) => {
        const lc = item.title.toLowerCase();
        const filter = value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      // If the search bar is empty, set newList to original task list
      newList = itemsState;
    }
    // Set the filtered state based on what our rules added to newList
    setFilteredItemsState(newList);
  };

  return (
    <>
      <RestaurantInfo {...sellerData} />
      {/* <Grid container direction="row" style={{ marginTop: 20 }}> */}
      <div>
        {/* <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={4}>
          <Typography
            gutterBottom
            variant="h5"
            style={{ textAlign: "center", marginBottom: 50 }}
            noWrap
          >
            Add, Edit, Delete Meals in your Tiffin Center&nbsp;&nbsp;
            <span role="img" aria-label="burger" style={{ fontSize: 40 }}>
              🍜
            </span>
          </Typography>
        </Grid> */}
        <div>
        <Typography
            gutterBottom
            variant="h5"
            style={{ textAlign: "center", margin: "2rem 0 0 0" }}
            noWrap
          >
            Add, Edit, Delete Meals in your Tiffin Center&nbsp;&nbsp;
            <span role="img" aria-label="burger" style={{ fontSize: 40 }}>
              🍜
            </span>
          </Typography>
        </div>
        <div className={classes.searchArea}>
          <SearchBar page="items" handleSearch={handleSearch} />
        </div>
        <RestaurantItems items={filteredItemsState} />
      </div>
      <div style={{display:"flex", alignItems:"center", flexDirection:"column", width:"100%", justifyContent:"center"}}>
      <Button className={classes.button} onClick={handleOpen}>
        Add Item
      </Button>
      </div>
      <ItemDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleFileSelect={handleFileSelect}
        inputs={inputs}
        handleInputChange={handleInputChange}
      />
      <Grid container direction="row" style={{ padding: "3rem" , borderTop : "1px solid #8c8c8c"}}>
        <Grid
          item
          xs={12}
          sm={12}
        >
          <Typography
            gutterBottom
            variant="h5"
            noWrap
            style={{ textAlign: "center" }}
          >
            Reviews from users
            <span role="img" aria-label="fries" style={{ fontSize: 25 }}>
              📝
            </span>
          </Typography>
        </Grid>
       
        <Reviews reviews={reviews} isSeller={true}/>
        
      </Grid>
    </>
  );
}
