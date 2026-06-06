import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Main from "./Main.jsx";
import { PanierProvider } from "./Context/PanierProvider.jsx";
import { UserProvider } from "./Context/UserProvider.jsx";
import { ProductsProvider } from "./Context/ProductsProvider.jsx";

function MyAppLaunch() {
  return (
    <UserProvider>
      <ProductsProvider>
        <PanierProvider>
          <BrowserRouter>
            <Header />
            <Main />
            <Footer />
          </BrowserRouter>
        </PanierProvider>
      </ProductsProvider>
    </UserProvider>
  );
}

export default MyAppLaunch;
