import { useState, useEffect, useContext } from 'react';
import constants from '../utils/constants'
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import UserContext from '../utils/UserContext';
import { useSelector } from 'react-redux';
import { useAuth } from '../components/auth/AuthContext';

export const Header = () => {

    const [btnNameReact, setBtnNameReact] = useState("Login");
    const onlineStatus = useOnlineStatus(true);
    const { loggedInUser } = useContext(UserContext);
    const cartItems = useSelector((store) => store.cart.items);
    const { isAuthenticated, user, logout } = useAuth();

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
        }
        // If not authenticated, the Link will handle navigation to login
    };

    // 1. If no dependency array => useEffect is called on every render
    // 2. If the dependency array is empty = [], the useEffect is called on the initial render(just once)
    // 3. If we have a non empty dependency array, then useEffect is called on every event of the change 
    //    in the dependency array
    // useEffect(() => {
    //     console.log("useEffect called");
    // });

    
    return (
        <div className="flex justify-between bg-black-100 shadow-lg sm:bg-green-50 lg:bg-red-100">
            <div className="logo-container">
                <img className="w-50" src={constants.LOGO_URL} alt="" />
            </div>

            <div className="flex items-center">
                <ul className="flex items-center">
                    <li className='font-bold'>
                        Online Status : {onlineStatus ? "🟢" : "🔴"}
                    </li>
                    <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                        <Link to="/">Home</Link>
                    </li>
                    <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                        <Link to="/about">About Us</Link>
                    </li>
                    <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                        <Link to="/cart">
                            Cart ({cartItems.length} items)
                        </Link>
                    </li>
                    <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                        <Link to="/grocery">Grocery</Link>
                    </li>
                    
                    {/* Authentication Section */}
                    {isAuthenticated ? (
                        <>
                            <li className='m-4 px-4 py-2 flex items-center rounded-lg bg-orange-400 cursor-pointer font-bold'>
                                Hello {user?.email}!
                            </li>
                            <button 
                                className="login m-4 px-4 py-2 flex items-center rounded-lg bg-red-200 cursor-pointer hover:font-bold hover:bg-red-400" 
                                onClick={handleAuthAction}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <li className='m-4 px-4 py-2 flex items-center rounded-lg hover:font-bold hover:bg-orange-400 cursor-pointer'>
                                <Link to="/login">Login</Link>
                            </li>
                            <li className='m-4 px-4 py-2 flex items-center rounded-lg bg-green-200 cursor-pointer hover:font-bold hover:bg-green-400'>
                                <Link to="/signup">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

        </div>
    );
}
