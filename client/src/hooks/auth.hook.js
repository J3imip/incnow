import {useState, useCallback, useEffect} from 'react';
import {useHttp} from './http.hook.js';

const storageName = 'userData';

export const useAuth = () => {
    const {request} = useHttp();
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((username, jwtToken, id)=>{ //login method
        setToken(jwtToken);
        setUsername(username);
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({
            username: username, userId: id, token: jwtToken
        })); //saving jwt, username and userId data to localStorage
    },[]);

    const logout = useCallback(()=>{
        setToken(null);
        setUserId(null);
        setUserId(null);
        localStorage.removeItem(storageName); //removing all data from localStorage
    },[]);

    useEffect(() => {
        async function checkToken() {
            const data = JSON.parse(localStorage.getItem(storageName));
            const result = await request(`http://109.234.37.59:4000/api/auth/check`, 'POST', {...data}); 
            // necessary check if token, username or userId was changed in localStorage.
            // if something was changed => logout

            if(result) {
                login(data.username, data.token, data.userId);
            } else {
                logout();
            }
        }

        checkToken();
    }, [])

    return {username, login, logout, token, userId}
}