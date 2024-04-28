import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";

import { SET_AUTHENTICATED } from "./redux/types";
import { logoutAction, getUserData } from "./redux/actions/authActions";

//axios
import axios from "./util/axios";

//jwt-decode
import jwtDecode from "jwt-decode";

//material-ui
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

//theme
import themeFile from "./util/theme";

//components
import AppBar from "./components/AppBar";
import Footer from "./components/Footer";

//util
import ScrollToTop from "./util/scrollToTop";

//restrict routes
import { AuthRoute, SellerRoute, UserRoute } from "./util/route";

//stripe

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

//pages
import home from "./pages/home";
import error404 from "./pages/404";
import signup from "./pages/sign-up";
import login from "./pages/login";
import addRestaurant from "./pages/addRestaurant";
import restaurant from "./pages/restaurant";
import sellerDash from "./pages/sellerDashboard";
import cart from "./pages/cart";
import orders from "./pages/orders";
import { fetchRestaurantsByAddress } from "./redux/actions/dataActions";
const theme = createMuiTheme(themeFile);

const token = localStorage.jwt;

if (token) {
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutAction());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  // const [stripeApiKey, setStripeApi] = useState("");
  // const [loadingStripe, setLoadingStripe] = useState(true);
  // async function getStripeApi(){
    // const key = await axios.get("/payment/stripeapi");
    // console.log("key"+key.data.stripeAPIKey);
    // if(!stripeApiKey)
    // setStripeApi(key.data.stripeAPIKey) ;
  //   try {
  //     const key = await axios.get("/payment/stripeapi");
  //     setStripeApi(key.data.stripeAPIKey);
  //     setLoadingStripe(false); // Set loading to false when key is fetched
  //   } catch (error) {
  //     console.error("Error fetching Stripe API key:", error);
  //     setLoadingStripe(false); // Set loading to false even on error
  //   }
  // }
  // const stripeApiKey="pk_test_51MQ0cGSJI45UgsmwOytPN1vCRRZcY6t3D9ItrYfv9rFqNJ5KUG2v1sRhEjGpoyrCjufR1Vhx20hPPSfE8r0t3uDN00i5gPqBQA";

  useEffect(() => {
    // getStripeApi();
    // console.log(stripeApiKey);
    store.dispatch(fetchRestaurantsByAddress(0, 0));
  }, []);
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <AppBar />
          <ScrollToTop />
          <Switch>
            <Route exact path="/" component={home} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/register" component={signup} />
            <AuthRoute exact path="/addtiffincenter" component={addRestaurant} />
            <UserRoute exact path="/order/:restName" component={restaurant} />
            <SellerRoute
              exact
              path="/seller/dashboard"
              component={sellerDash}
            />
            {/* {stripeApiKey&&(
              <Elements stripe={loadStripe(stripeApiKey)}> */}

            <UserRoute exact path="/cart" component={cart} />
            {/* </Elements>
            )} */}



            <UserRoute exact path="/orders" component={orders} />
            <SellerRoute exact path="/seller/orders" component={orders} />
            <Route component={error404} />
          </Switch>
          <Footer />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
