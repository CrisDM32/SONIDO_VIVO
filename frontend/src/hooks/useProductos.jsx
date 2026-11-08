import { useState,useEffect } from "react";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [estado, setEstado] = useState("");

    const cargarProductos = async () => {
        try {
            setEstado("LOADING");
            const respuesta = await fetch('http://localhost:8080/api/v1/productos');
            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            setProductos(datos);
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
