package cl.sonidovivo.productos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.sonidovivo.productos.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

	List<Producto> findByActivoTrueOrderByIdAsc();

	boolean existsByNombreIgnoreCase(String nombre);

	boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

}
