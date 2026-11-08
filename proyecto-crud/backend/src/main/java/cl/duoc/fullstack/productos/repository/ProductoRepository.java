package cl.duoc.fullstack.productos.repository;

import cl.duoc.fullstack.productos.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findAllByOrderByNombreAsc();
}
