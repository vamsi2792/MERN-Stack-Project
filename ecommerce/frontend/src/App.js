import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListOfProducts from "./components/ListOfProducts";
import Cart from "./components/Cart";
import WishList from "./components/WishList";
import ViewProduct from "./components/ViewProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import MyProfile from "./components/MyProfile.js";

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <div>{children}</div>
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ListOfProducts />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/product/:id" element={<ViewProduct />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}


export default App;
