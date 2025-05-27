import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import BlogCategory from "./pages/BlogCategory";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import TermsOfService from "./pages/TermsOfService";

// Layout Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";  // <-- Import Footer
import PrivacyPolicy from "./pages/PrivacyPolicy";

const RootLayout = () => (
  <>
  <div className="dark:bg-[#1C1C1E] bg-[#F5F5F5] transition-colors duration-700 min-h-screen flex flex-col">
  <Navbar />
  
  {/* Add padding top to avoid content hiding behind Navbar */}
  <main className="flex-grow flex flex-col pt-16"> 
    <Outlet />
  </main>

  <Footer /> {/* Footer appears on all pages */}
</div>

  </>
);

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/aboutus", element: <AboutUs /> },
        { path: "/blog", element: <Blog /> },
        { path: "/blog/:category", element: <BlogCategory /> },
        { path: "/blog/detail/:slug", element: <BlogDetail /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/admin", element: <AdminDashboard /> },
        { path: "/terms-&-conditions", element: <TermsOfService /> },
        { path: "/privacy-policy", element: <PrivacyPolicy/> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true } }
);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
