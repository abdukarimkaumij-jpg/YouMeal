import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ProductsContext } from "./context/product-context.jsx";
import { CategoryContext } from "./context/categories-context.jsx";
import { RegisterProvider } from "./context/register-context.jsx";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./context/login-context.jsx";
import { AuthProvider } from "./context/authMe-context.jsx";
import { CartProvider } from "./context/cart-context.jsx";
import { ToastProvider } from "./context/toast-context.jsx";
import { ProductDetailsProvider } from "./context/product-details-context.jsx";
import { OrderProvider } from "./context/order-context.jsx";


createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <StrictMode>
      <ToastProvider>
      <ProductsContext>
        <CategoryContext>
          <AuthProvider>
            <CartProvider>
              <RegisterProvider>
                <LoginProvider>
                  <ProductDetailsProvider>
                    <OrderProvider>
                      <App />
                    </OrderProvider>
                  </ProductDetailsProvider>
                </LoginProvider>
              </RegisterProvider>
            </CartProvider>
          </AuthProvider>
        </CategoryContext>
      </ProductsContext>
      </ToastProvider>
    </StrictMode>
    </BrowserRouter>
);
