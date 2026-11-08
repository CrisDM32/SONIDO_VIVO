import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test } from "vitest";
import PagoTarjeta from "./PagoTarjeta";
import { validarPagoTarjeta } from "../utils/validacionPagoTarjeta";

const hoy = new Date(2026, 9, 15); // octubre de 2026

const formValido = {
  nombreTitular: "Ana Pérez",
  numeroTarjeta: "1234 5678 9012 3456",
  fechaVencimiento: "2028-05",
  ccv: "123",
};

beforeEach(() => {
  localStorage.setItem(
    "sv_carrito",
    JSON.stringify([{ id: 1, nombre: "Guitarra", precio: 100000, icono: "🎸", cantidad: 1 }])
  );
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

test("el formulario de pago con tarjeta se renderiza correctamente", () => {
  render(<PagoTarjeta />);

  expect(screen.getByRole("textbox", { name: "Nombre del titular" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Número de tarjeta" })).toBeTruthy();
  expect(screen.getByLabelText("Fecha de vencimiento")).toBeTruthy();
  expect(screen.getByLabelText("CCV")).toBeTruthy();
  expect(screen.getByRole("button", { name: /Pagar/ })).toBeTruthy();
});

test("al enviar sin completar los campos, se muestran los mensajes de error", async () => {
  const user = userEvent.setup();
  render(<PagoTarjeta />);

  await user.click(screen.getByRole("button", { name: /Pagar/ }));

  expect(screen.getByText("Escribe el nombre del titular (mínimo 3 caracteres).")).toBeTruthy();
  expect(screen.getByText("Ingresa un número de tarjeta válido (13 a 19 dígitos).")).toBeTruthy();
  expect(screen.getByText("Selecciona la fecha de vencimiento.")).toBeTruthy();
  expect(screen.getByText("El CCV debe tener 3 o 4 dígitos.")).toBeTruthy();
});

test("con el carrito vacío el botón de pagar está deshabilitado", () => {
  localStorage.clear();
  render(<PagoTarjeta />);

  expect(screen.getByRole("button", { name: /Pagar/ }).disabled).toBe(true);
});

test("validarPagoTarjeta no devuelve errores con datos válidos", () => {
  expect(validarPagoTarjeta(formValido, hoy)).toEqual({});
});

test("validarPagoTarjeta rechaza un titular corto o con números", () => {
  expect(validarPagoTarjeta({ ...formValido, nombreTitular: " Al " }, hoy).nombreTitular).toBeTruthy();
  expect(validarPagoTarjeta({ ...formValido, nombreTitular: "Ana 123" }, hoy).nombreTitular).toBeTruthy();
});

test("validarPagoTarjeta revisa solo el largo del número de tarjeta", () => {
  const conNumero = (numeroTarjeta) =>
    validarPagoTarjeta({ ...formValido, numeroTarjeta }, hoy).numeroTarjeta;

  expect(conNumero("")).toBeTruthy();
  expect(conNumero("1234 5678")).toBeTruthy();
  expect(conNumero("1234 5678 9012 abcd")).toBeTruthy();
  expect(conNumero("1".repeat(20))).toBeTruthy();
  expect(conNumero("1234567890123")).toBeUndefined();
  expect(conNumero("1234 5678 9012 3456")).toBeUndefined();
});

test("validarPagoTarjeta rechaza fechas vacías o vencidas", () => {
  const conFecha = (fechaVencimiento) =>
    validarPagoTarjeta({ ...formValido, fechaVencimiento }, hoy).fechaVencimiento;

  expect(conFecha("")).toBeTruthy();
  expect(conFecha("2025-12")).toBeTruthy();
  expect(conFecha("2026-09")).toBeTruthy();
  expect(conFecha("2026-10")).toBeUndefined();
  expect(conFecha("2027-01")).toBeUndefined();
});

test("validarPagoTarjeta exige un CCV de 3 o 4 dígitos", () => {
  const conCcv = (ccv) => validarPagoTarjeta({ ...formValido, ccv }, hoy).ccv;

  expect(conCcv("")).toBeTruthy();
  expect(conCcv("12")).toBeTruthy();
  expect(conCcv("12345")).toBeTruthy();
  expect(conCcv("abc")).toBeTruthy();
  expect(conCcv("123")).toBeUndefined();
  expect(conCcv("1234")).toBeUndefined();
});
