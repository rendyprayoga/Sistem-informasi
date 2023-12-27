import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Authenticated({ children }) {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.store);
    useEffect(() => {
        if (!auth?.isLogin) {
            navigate("/login")
        }
    }, [navigate])
    return children;
}