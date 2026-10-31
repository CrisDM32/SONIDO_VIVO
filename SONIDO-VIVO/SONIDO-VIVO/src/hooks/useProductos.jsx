import { useState,useEffect } from "react";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [estado, setEstado] = useState("");

    const cargarProductos = async () => {
        try {
            setEstado("LOADING");
            const respuesta = await fetch('http://localhost:8080/api/productos');
            const datos = await respuesta.json();
            setProductos(datos.data);
            setEstado("SUCCESS");
            
        }
        catch(error){
            console.log(error);
            setEstado("ERROR")
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    return{
        productos,
        estado
    }
}
