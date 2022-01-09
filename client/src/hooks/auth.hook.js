import {useState, useCallback, useEffect} from 'react';
import {useHttp} from './http.hook.js';

const storageName = 'userData';

export const useAuth = () => {
    const {request} = useHttp();
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = useCallback((username, jwtToken, id)=>{
        setToken(jwtToken);
        setUsername(username);
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({
            username: username, userId: id, token: jwtToken
        }));
    },[]);

    const logout = useCallback(()=>{
        setToken(null);
        setUserId(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    },[]);

    useEffect(async() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        const result = await request(`http://localhost:3600/api/auth/check`, 'POST', {...data});

        if(result) {
            login(data.username, data.token, data.userId);
        } else {
            logout();
        }
    }, [])

    return {username, login, logout, token, userId}
}