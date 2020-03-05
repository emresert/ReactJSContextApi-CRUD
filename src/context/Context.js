import React, { Component } from 'react';
import alertify from "alertifyjs"

const CapsuleContext = React.createContext();



// *******  Reducer Part for Controlling Actions  *********** ///

const reducer = (state, action) => {
  switch (action.type) {

    case "CHANGE_CURRENT_CATEGORY":
      return {
        ...state,
        currentCategory: action.payload.id,
      }
      
    case "GET_PRODUCTS_BY_ID":
      return {
        filteredProduct: state.products.filter(x => x.categoryId === action.payload.id)
      }

    case "SAVE_CATEGORY_TO_API":
      fetch("http://localhost:3000/categories/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(action.payload),
        ...state,
        categories: state.categories.push(action.payload),
      })
      break;

      case "UPDATE_CATEGORY":
      fetch("http://localhost:3000/categories/"+ action.payload.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(action.payload),
        ...state,
        categories: state.categories.push(action.payload),
      })
      break;

      case "DELETE_CATEGORY":
        fetch("http://localhost:3000/categories/"+action.payload.id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(action.payload)
        })
        return {
          ...state,
          categories:state.categories.filter(c=>c.id !== action.payload.id)
        }
        
    default:
    return state
  }
}
  
export class CapsuleProvider extends Component {

  // initial state for Provider and Consumer
  state = {
    currentCategory: "",
    categories: [],
    filteredProduct: [],
    products: [],
    apiUrl: "http://localhost:3000/",
    cart: [],
    history:[],
    dispatch: action => {
      this.setState(state => reducer(state, action))
    }
  }

   /**************  Methods of Category  ******************/ 

  // Fetching categories method when the project starts
  getCategories = () => {
    fetch(this.state.apiUrl + "categories")
      .then(res => res.json())
      .then(data => this.setState({ categories: data }));
  }


 /**************  Methods of Product  ******************/ 

  // Fetching products method when the project starts according to defining categoryId
  getProducts(category) {
    if (category.id) {
      fetch(this.state.apiUrl + "products/?categoryId=" + category.id).then(res => res.json()).then(
        data => this.setState({ products: data }),
        data => this.setState({ filteredProduct: data })
      )
    }
    else {
      fetch(this.state.apiUrl + "products").then(res => res.json()).then(
        data => this.setState({ products: data }))
    }
  }






  /* --- Methods of Cart ---*/
  addToCart = (_product) => {
    let newCart = this.state.cart;
    let addedItem = newCart.find(p => p.product.id === _product.id)

    if (addedItem) {
      addedItem.quantity = addedItem.quantity + 1;
    }
    else {
      newCart.push({ product: _product, quantity: 1 });
    }

    this.setState({ cart: newCart });
    alertify.success(_product.productName + " is added to cart")
  }

  removeItemFromCart = (_product) => {
    let newCart = this.state.cart.filter(p => p.product.id !== _product.id);
    this.setState({ cart: newCart });
   alertify.error(_product.productName + " removed from cart")
  }



  componentDidMount() {
    this.getCategories();
    this.getProducts(this.state.currentCategory);
  }

  render() {
    return (
      <CapsuleContext.Provider value={this.state}>
        {this.props.children}
      </CapsuleContext.Provider>
    );
  }
}
const CapsuleConsumer = CapsuleContext.Consumer;

export default CapsuleConsumer;
