import React, { useState, useEffect } from 'react';
import {getSubCategory} from "../../utils/sub";
import { useParams } from 'react-router-dom';
import ProductCard from "../../components/cards/ProductCard";

const SubHome = () => {
  const { slug } = useParams();
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubCategory(slug)
      .then(res => {
        setSub(res.data.sub);
        setProducts(res.data.products);
        setLoading(false);
      })

  }, [])

  return (
    <>
      <div
        className="text-center p-3 mt-5 mb-5 bg-light"
      >
        { loading ? (
          <h4 className='display-6'>Loading...</h4>
        ) : (
          <h4 className='display-6'>
            { products.length } Products in "{ sub.name }" sub category
          </h4>
        ) }
      </div>
      <div className="container">
        <div className="row">
          { products.map(p => (
            <div className='col-md-4 mb-4' key={p._id}>
              <ProductCard
                product={p}
              />
            </div>
          )) }
        </div>
      </div>
    </>
  )
}

export  default SubHome;
