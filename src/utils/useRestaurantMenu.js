import { useEffect, useState } from "react";
import constants from "./constants";

// It only fetches the data of the RestaurantMenu
// Making the API call and getting the data
const useRestaurantMenu = (resId) => {
    // Create state variable to hold the data
    const[resInfo, setResInfo] = useState(null);
    const[error, setError] = useState(null);

    // Fetches the data, fetching the data only once so we will write empty square bracket
    useEffect(() => {
        if (resId) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resId]);

    const fetchData = async () => {
        try {
            setError(null);
            const response = await fetch(
                constants.CORS_PLUGIN + 
                constants.URL + 
                resId + 
                constants.REMAINING_URL
            );
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get text first to check if it's empty
            const text = await response.text();
            if (!text || text.trim() === '') {
                throw new Error("Empty response from server");
            }
            
            // Try to parse JSON
            let json;
            try {
                json = JSON.parse(text);
            } catch (parseError) {
                console.error("Invalid JSON response:", text.substring(0, 200));
                throw new Error("Invalid JSON response from server");
            }
            
            // Check if data exists
            if (!json || !json.data) {
                throw new Error("No data in response");
            }
            
            setResInfo(json.data);
        } catch (error) {
            console.error("Error fetching restaurant menu:", error);
            setError(error.message);
            setResInfo(null);
        }
    }

    return { resInfo, error };
}

export default useRestaurantMenu;