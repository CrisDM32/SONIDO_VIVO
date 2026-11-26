package cl.sonidovivo.productos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 60)
    private String categoria;

    @Column(nullable = false)
    private double precio;

    // El stock reemplaza al booleano "disponible" fijo que tenia el frontend:
    // ahora la disponibilidad se calcula a partir de este numero (ver getDisponible()).
    @Column(nullable = false)
    private int stock;

    // Emoji que usa el frontend como reemplazo de una foto real del producto
    // (el catalogo definitivo de 340 productos con fotos llega en un Excel aparte).
    @Column(length = 10)
    private String icono;

    // Texto libre con las especificaciones del producto (material, medidas,
    // que trae incluido, etc.). Es lo que se muestra en la vista de detalle;
    // en la tarjeta del catalogo no se usa, ahi solo importa lo esencial.
    @Column(length = 1000)
    private String descripcion;

    public Producto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Transient
    public boolean isDisponible() {
        return stock > 0;
    }
}
