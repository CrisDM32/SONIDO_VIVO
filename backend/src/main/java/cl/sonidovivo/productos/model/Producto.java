package cl.sonidovivo.productos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 120)
	private String nombre;

	@Column(nullable = false, length = 60)
	private String categoria;

	@Column(nullable = false)
	private int precio;

	@Column(nullable = false, length = 16)
	private String icono;

	@Column(nullable = false)
	private int stock;

	@Column(nullable = false)
	private boolean activo = true;

	public Producto() {
	}

	public Producto(String nombre, String categoria, int precio, String icono, int stock) {
		this.nombre = nombre;
		this.categoria = categoria;
		this.precio = precio;
		this.icono = icono;
		this.stock = stock;
	}

	/** Un producto se puede comprar si está activo y le queda stock. */
	public boolean isDisponible() {
		return activo && stock > 0;
	}

	public Long getId() {
		return id;
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

	public int getPrecio() {
		return precio;
	}

	public void setPrecio(int precio) {
		this.precio = precio;
	}

	public String getIcono() {
		return icono;
	}

	public void setIcono(String icono) {
		this.icono = icono;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

}
