import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Shop from './components/Shop';
import EditOrchid from './components/EditOrchid';
import HomeScreen from './components/HomeScreen';
import NavBar from './components/NavBar';
import DetailOrchid from './components/DetailOrchid';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Order from './components/Order';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/detail/:id" element={<DetailOrchid />} />
                    <Route path="/edit/:id" element={<EditOrchid />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}