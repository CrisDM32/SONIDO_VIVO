import { expect, test } from "vitest";
import { numerosDePagina, paginar } from "../../utils/paginacion";

const lista = Array.from({ length: 30 }, (_, i) => i + 1);

test("paginar entrega la página pedida y el rango mostrado", () => {
  expect(paginar(lista, 1, 12)).toMatchObject({ items: lista.slice(0, 12), total: 30, totalPaginas: 3, pagina: 1, desde: 1, hasta: 12 });
  expect(paginar(lista, 3, 12)).toMatchObject({ items: lista.slice(24), pagina: 3, desde: 25, hasta: 30 });
});

test("paginar corrige páginas fuera de rango y maneja listas vacías", () => {
  expect(paginar(lista, 99, 12).pagina).toBe(3);
  expect(paginar(lista, 0, 12).pagina).toBe(1);
  expect(paginar([], 1, 12)).toMatchObject({ items: [], total: 0, totalPaginas: 1, pagina: 1, desde: 0, hasta: 0 });
});

test("numerosDePagina lista todas las páginas si son pocas", () => {
  expect(numerosDePagina(1, 1)).toEqual([1]);
  expect(numerosDePagina(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("numerosDePagina usa saltos (…) si son muchas y siempre incluye la primera, la última y las vecinas", () => {
  expect(numerosDePagina(1, 20)).toEqual([1, 2, 3, 4, "…", 20]);
  expect(numerosDePagina(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
  expect(numerosDePagina(20, 20)).toEqual([1, "…", 17, 18, 19, 20]);
  expect(numerosDePagina(4, 20)).toEqual([1, 2, 3, 4, 5, "…", 20]);
});
