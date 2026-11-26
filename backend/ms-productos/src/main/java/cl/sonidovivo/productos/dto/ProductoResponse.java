package cl.sonidovivo.productos.dto;

import cl.sonidovivo.productos.model.Producto;

public class ProductoResponse {

    private Long id;
    private String nombre;
    private String categoria;
    private double precio;
    private int stock;
    private boolean disponible;
    private String icono;
    private String descripcion;

    public static ProductoResponse desde(Producto producto) {
        ProductoResponse respuesta = new ProductoResponse();
        respuesta.id = producto.getId();
        respuesta.nombre = producto.getNombre();
        respuesta.categoria = producto.getCategoria();
        respuesta.precio = producto.getPrecio();
        respuesta.stock = producto.getStock();
        respuesta.disponible = producto.isDisponible();
        respuesta.icono = producto.getIcono();
        respuesta.descripcion = producto.getDescripcion();
        return respuesta;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public double getPrecio() {
        return precio;
    }

    public int getStock() {
        return stock;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public String getIcono() {
        return icono;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
