import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Store() {
    const [store, setStore] = useState([]);
const navigate = useNavigate();
    useEffect(() => {
        fetchStore()
    }, [])

    const fetchStore = async () => {
        try {
            const response = await api.get("/store");
            console.log(response);
            // setStore(response.data.data)
        } catch (err) {
            const {response} = err;
            console.log(response)
            if(response.status === 401){
                alert(err.response.data.message);
                localStorage.clear()
                navigate("/")
            }
            
            alert(err.response.data.message);
            console.log("fetchstore err " , err.response.data.message)
        }
    }

    return (
        <div>
            {store.map((book) => (
                <div key={book._id}>
                    <h2>{book.author}</h2>
                </div>
            ))}
        </div>
    )
}