import { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Header } from './Components/Header';
import Body from './Components/Body';
import Footer from "./Components/Footer";
import Contact from "./Components/Contact";
import Error from "./Components/Error";
import Cart from "./Components/Cart";
import RestaurantMenu from "./Components/RestaurantMenu";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import About from "./Components/About";
import { useState } from "react";
import UserContext from "./utils/UserContext";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import { AuthProvider } from "./components/auth/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Grocery = lazy(() => import("./components/Grocery"));


const AppLayout = () => {
    const [userName, setUserName] = useState();

    useEffect(() => {
        // Make an API call and send username and password
        const data = {
            name: "Harsh Ramchandani"
        };
        setUserName(data.name);
    }, []);

    return (
        <Provider store={appStore}>
            <AuthProvider>
                <UserContext.Provider value={{ loggedInUser: userName, setUserName }}>
                    <ProtectedRoute>
                        <div className="app">
                            <Header />
                            <Outlet />
                            <Footer />
                        </div>
                    </ProtectedRoute>
                </UserContext.Provider>
            </AuthProvider>
        </Provider>
    )
}

// Auth Layout for login/signup pages
const AuthOnlyLayout = () => {
    return (
        <Provider store={appStore}>
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        </Provider>
    )
}

const appRouter = createBrowserRouter([
    // Authentication routes (public)
    {
        path: "/login",
        element: <AuthOnlyLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            }
        ]
    },
    {
        path: "/signup", 
        element: <AuthOnlyLayout />,
        children: [
            {
                path: "/signup",
                element: <SignupPage />,
            }
        ]
    },
    // Main app routes (protected)
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Body />,
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/restaurants/:resId",
                element: <RestaurantMenu />,
            },
            {
                path: "/grocery",
                element: <Suspense fallback={<h1>The Grocery Page is Loading!!!</h1>}>
                    <Grocery />
                </Suspense>,
            },
            {
                path: "/cart",
                element: <Cart />,
            }
        ],
        errorElement: <Error />,
    },
])


const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<AppLayout />);
root.render(<RouterProvider router={appRouter} />);

