import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import BuyBooks from "./pages/BuyBooks"
import SellBooks from "./pages/SellBooks"
import BookDetails from "./pages/BookDetails"
import Profile from "./pages/Profile"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buy" element={<BuyBooks />} />
          <Route path="/sell" element={<SellBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
