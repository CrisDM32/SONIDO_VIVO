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

	// Nullable: los productos anteriores al catálogo con códigos no lo tienen.
	@Column(unique = true, length = 20)
	private String codigo;

	@Column(nullable = false, unique = true, length = 120)
	private String nombre;

	@Column(length = 60)
	private String marca;

	@Column(length = 60)
	private String modelo;

	@Column(length = 500)
	private String descripcion;

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

	// Con DEFAULT para que ddl-auto=update pueda agregar la columna a una tabla que ya tiene filas (PostgreSQL).
	@Column(nullable = false, columnDefinition = "boolean not null default false")
	private boolean destacado = false;

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

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public String getModelo() {
		return modelo;
	}

	public void setModelo(String modelo) {
		this.modelo = modelo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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

	public boolean isDestacado() {
		return destacado;
	}

	public void setDestacado(boolean destacado) {
		this.destacado = destacado;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

}
