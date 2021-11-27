import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";


import Home from "./components/Home";
import Login from "./components/user/Login";
import Register from './components/user/Register';
import ProtectedRoute from './components/route/ProtectedRoute';
import Profile from './components/user/Profile';
import UpdatedProfile from './components/user/UpdatedProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
import ProductDetail from './components/product/ProductDetail';

//Cart
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'


//Admin Imports
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { loadUser } from './actions/userActions'
import store from './store'

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');
 
  useEffect(() => {
    //const token = req.cookies.jwt
    
    store.dispatch(loadUser())
    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/payments/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();
  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
            <Route path = "/" component={Home} exact />
            <Route path = "/search/:keyword" component={Home} exact />
            <Route path = "/products/:id" component={ProductDetail} exact />
            <Route path = "/cart" component={Cart} exact />
            <Route path = "/login" component={Login} exact />
            <Route path = "/signup" component={Register} exact />
            <Route path="/password/reset/:token" component={NewPassword} exact />
            <Route path="/password/forgot" component={ForgotPassword} exact />
            <ProtectedRoute path = "/shipping" component={Shipping} />
            <ProtectedRoute path = "/confirm" component={ConfirmOrder} />
            <ProtectedRoute path = "/success" component={OrderSuccess} />
            {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
            }

            <ProtectedRoute path="/orders/me" component={ListOrders} exact />
            <ProtectedRoute path="/order/:id" component={OrderDetails} exact />
            <ProtectedRoute path = "/me" component={Profile} exact />
            <ProtectedRoute path = "/me/update" component={UpdatedProfile} exact />
            <ProtectedRoute path="/password/update" component={UpdatePassword} exact />
           </div> 
            <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
            <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductsList} exact />
            <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact />
            <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
            <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact />
            <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact />
            <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact />
            <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
            <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact />
        
         {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
