import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  HelpCircle,
  Globe2,
  Home,
  Settings,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { logout } from "../store/slices/authSlice";
import { resetCart } from "../store/slices/cartSlice";
import logo from "../assets/pvv-logo.png";
import "./Navbar.css";

const categories = [
  { label: "Cricket Shop", to: "/products" },
  { label: "Cricket Bats", to: "/products?category=bats" },
  { label: "Cricket Gloves", to: "/products?category=gloves" },
  { label: "Cricket Pads", to: "/products?category=pads" },
  { label: "Wicket Keeping", to: "/products?category=keeping" },
  { label: "Cricket Helmets", to: "/products?category=helmets" },
  { label: "Cricket Footwear", to: "/products?category=shoes" },
  { label: "Cricket Bags", to: "/products?category=bags" },
  { label: "Cricket Clothing", to: "/products?category=clothing" },
  { label: "Cricket Balls", to: "/products?category=balls" },
  { label: "Cricket Protection", to: "/products?category=protection" },
  { label: "Ground Equipment", to: "/products?category=ground" },
  { label: "Other Stores", to: "/products?category=others" },
  { label: "Sale", to: "/products?sale=true", accent: true },
];

const splitLabel = (label) => {
  const parts = label.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
};

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { itemCount } = useAppSelector((s) => s.cart);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    navigate("/");
    setMobileOpen(false);
  };

  // Active-state checker
  const getActiveFor = (to) => {
    const curPath = location.pathname;
    const curParams = new URLSearchParams(location.search);

    if (to === "/") return curPath === "/";

    if (to === "/products") {
      return (
        curPath === "/products" &&
        !curParams.get("category") &&
        !curParams.get("sale") &&
        !curParams.get("search")
      );
    }

    if (to.startsWith("/products?category=")) {
      const linkParams = new URLSearchParams(to.split("?")[1]);
      return (
        curPath === "/products" &&
        curParams.get("category") === linkParams.get("category")
      );
    }

    if (to.startsWith("/products?sale=")) {
      const linkParams = new URLSearchParams(to.split("?")[1]);
      return (
        curPath === "/products" &&
        curParams.get("sale") === linkParams.get("sale")
      );
    }

    return curPath === to;
  };

  return (
    <header className="site-header" role="banner">
      {/* === Top Bar === */}
      <div className="nav-top">
        <div className="nav-top__inner">
          <Link to="/" className="brand" onClick={() => setMobileOpen(false)}>
            <img
              src={logo}
              alt="PVV Sports"
              className="brand__logo-img"
              width={72}
              height={72}
            />
          </Link>

          <form
            className="search"
            onSubmit={onSearch}
            role="search"
            aria-label="Search products"
          >
            <Search />
            <input
              type="search"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search__submit">
              Search
            </button>
          </form>

          <div className="utils">
            <Link to="/help" className="util-link">
              <HelpCircle />
              <span className="util-text">Help</span>
            </Link>

            <button className="util-link util-dropdown" type="button">
              <Globe2 />
              <span className="util-text">UK (GBP £)</span>
            </button>

            <button 
              className="icon-pill" 
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun /> : <Moon />}
            </button>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="icon-pill" title="Admin Panel">
                    <Settings />
                  </Link>
                )}
                <Link to="/favorites" className="icon-pill" title="Favorites">
                  <Heart />
                </Link>
                <Link to="/profile" className="icon-pill" title="Profile">
                  <User />
                </Link>
                <button
                  className="icon-pill icon-pill--danger"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="util-text-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn--primary btn--sm">
                  Register
                </Link>
              </>
            )}

            <Link to="/cart" className="icon-pill cart-pill" aria-label="Cart">
              <ShoppingCart />
              {itemCount > 0 && <span className="badge">{itemCount}</span>}
            </Link>

            <button
              className="hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* === Category Rail === */}
      <nav className="nav-rail" aria-label="Primary categories">
        <div className="nav-rail__row">
          <Link
            to="/"
            className={`rail-link rail-link--home ${
              getActiveFor("/") ? "is-active" : ""
            }`}
            title="Home"
          >
            <Home />
          </Link>

          {categories.map((c) => {
            const [top, bottom] = splitLabel(c.label);
            const isActive = getActiveFor(c.to);
            return (
              <Link
                key={c.label}
                to={c.to}
                className={`rail-link ${c.accent ? "rail-link--accent" : ""} ${
                  isActive ? "is-active" : ""
                }`}
                title={c.label}
              >
                <span className="rail-top">{top}</span>
                <span className="rail-bottom">{bottom}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* === Mobile Menu === */}
      <div
        id="mobile-nav"
        className={`mobile ${mobileOpen ? "mobile--open" : ""}`}
      >
        <form
          className="mobile__search"
          onSubmit={onSearch}
          role="search"
          aria-label="Mobile search"
        >
          <Search />
          <input
            type="search"
            placeholder="Search for anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </form>

        <div className="mobile__group">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="mobile__item"
          >
            <Home /> <span>Home</span>
          </Link>
          {categories.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className={`mobile__item ${
                c.accent ? "mobile__item--accent" : ""
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <span>{c.label}</span>
            </Link>
          ))}
        </div>

        <div className="mobile__group">
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="mobile__item"
          >
            <ShoppingCart />{" "}
            <span>Cart {itemCount > 0 ? `(${itemCount})` : ""}</span>
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mobile__item"
                >
                  <Settings /> <span>Admin Panel</span>
                </Link>
              )}
              <Link
                to="/favorites"
                onClick={() => setMobileOpen(false)}
                className="mobile__item"
              >
                <Heart /> <span>Favorites</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="mobile__item"
              >
                <User /> <span>Profile</span>
              </Link>
              <button
                className="mobile__btn mobile__btn--danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mobile__btn mobile__btn--ghost"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="mobile__btn mobile__btn--primary"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
