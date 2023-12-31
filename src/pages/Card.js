import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import { useNavigate } from 'react-router-dom'
import { userCart } from "../utils/users";

const Card = () => {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useNavigate();

  const getTotal = () => {
    return cart.reduce((current, next) => {
      return current + next.count * next.price
    }, 0)
  }

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then(res => {
        if (res.data.ok) history('/checkout');
      })
      .catch(err => {
        console.log(err);
      })
  }

  const showCartItems = () => (
    <table className='table table-bordered align-middle'>
      <thead className='table-info '>
        <tr>
          <th scope='col'>Image</th>
          <th scope='col'>Title</th>
          <th scope='col'>Price</th>
          <th scope='col'>Brand</th>
          <th scope='col'>Color</th>
          <th scope='col'>Count</th>
          <th scope='col'>Shipping</th>
          <th scope='col'>Remove</th>
        </tr>
      </thead>
      <tbody>
        {
          cart.map((p) => (
            <ProductCardInCheckout
              key={p._id}
              p={p}
            />
          ))
        }
      </tbody>
    </table>
  )

  const saveCashOrderToDb = () => {
    dispatch({
      type: 'COD',
      payload: true
    });
    userCart(cart, user.token)
      .then(res => {
        if (res.data.ok) history('/checkout');
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-md-8">

          {
            !cart.length ? (
              <h4>No products in cart. <Link to='/shop'>Continue shopping</Link></h4>
            ) : (
              <>
                <h4>Cart / { cart.length} Product</h4>
                { showCartItems() }
              </>
            )
          }
        </div>
        <div className="col-md-4">
          <h4>Order summary</h4>
          <hr/>
          <p>Products</p>
          {cart.map((c, i) => (
             <div key={i}>
               <p>{c.title} x {c.count} = ${c.price * c.count}</p>
             </div>
          ))}
          <hr/>
          Total: <b>${getTotal()}</b>
          <hr/>
          {
            user ? (
              <>
                <button
                  onClick={saveOrderToDb}
                  className='btn btn-sm btn-primary mt-2'
                  disabled={!cart.length}
                >Proceed to Checkout</button>
                <button
                  onClick={saveCashOrderToDb}
                  className='btn btn-sm btn-warning mt-2 ms-3'
                  disabled={!cart.length}
                >Pay Cash on Delivery</button>
              </>
            ) : (
              <button className='btn btn-sm btn-primary mt-2'>
                <Link
                  to={{
                    pathname: '/login',
                    state: {from: 'cart' }
                  }}
                >
                  Login to Checkout
                </Link>
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Card
