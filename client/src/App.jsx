import Navbar from "./pages/Navbar";
import Content from "./pages/Content";
import ItemDetails from "./pages/ItemDetails";
import CartItems from "./pages/CartItems";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Content />} />
          <Route path="/item/:id" exact element={<ItemDetails />} />
          <Route path="/cartItems" exact element={<CartItems />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
