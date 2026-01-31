import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  const location = useLocation();

  
  const hideLayoutRoutes = ["/login", "/register"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!hideLayout && <Header />}

          <div style={{ flex: 1 }}>
            <AppRoutes />
          </div>

          {!hideLayout && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
