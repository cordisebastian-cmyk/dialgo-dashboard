import { useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, AreaChart, Area } from "recharts";

const RAW = [
  {"n": "1", "f": "2022-06-28", "c": "Ludmila Janik", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Craquelada", "prod": "Taza Craquelada (2)", "uni": 2, "m": 3460.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "2", "f": "2022-06-28", "c": "Valentina Perosio", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada/Craquelada", "prod": "Taza Jaspeada (1) + Taza Craquelada (1) + Pocillo Craquelado (2)", "uni": 4, "m": 6120.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "3", "f": "2022-06-28", "c": "Gina Crivelli", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Craquelada", "prod": "Taza Craquelada (3) + Pocillo Craquelado (3)", "uni": 6, "m": 9180.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "4", "f": "2022-07-07", "c": "Coqui (Belalugosi bar)", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (5)", "uni": 5, "m": 8650.0, "tipo": "B2B", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "5", "f": "2022-07-14", "c": "Santiago Bustos", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1730.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "6", "f": "2022-07-21", "c": "Gea Visintini", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (6)", "uni": 6, "m": 11880.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "7", "f": "2022-07-26", "c": "Nahuel Ramon", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 3460.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "8", "f": "2022-08-02", "c": "Clara Callejo", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 3460.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "9", "f": "2022-08-10", "c": "Coqui (Belalugosi)", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (5)", "uni": 5, "m": 8650.0, "tipo": "B2B", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "10", "f": "2022-09-01", "c": "Ignacio Bondone", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1980.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "11", "f": "2022-10-14", "c": "Antonella Boglione", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (1)", "uni": 1, "m": 0.0, "tipo": "Canje", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "12", "f": "2022-10-20", "c": "Fatima Masin", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1980.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "13", "f": "2022-10-28", "c": "Ignacio Bondone", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1980.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "14", "f": "2022-11-15", "c": "Daniel Talavera", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (6)", "uni": 6, "m": 10692.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "15", "f": "2022-11-20", "c": "Alejandra Tomassetti", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (6)", "uni": 6, "m": 9672.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "16", "f": "2022-11-25", "c": "Ignacio Bondone", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1980.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "17", "f": "2022-12-01", "c": "Omar Paris", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (2) + Jarra Jaspeada (1 preventa)", "uni": 2, "m": 7300.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "18", "f": "2022-12-10", "c": "Florencia Arias", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada Especial (6)", "uni": 6, "m": 11880.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "19", "f": "2023-01-15", "c": "Coqui", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (4)", "uni": 4, "m": 7160.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "20", "f": "2023-02-01", "c": "Gina Crivelli", "sexo": "F", "edad": "", "prov": "Salta", "ciudad": "Salta Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (1)", "uni": 1, "m": 3465.0, "tipo": "B2C", "recurrente": false, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "21", "f": "2023-02-01", "c": "Gonzalo Alvares", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (4) + Jarra Jaspeada (1)", "uni": 5, "m": 10000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "22", "f": "2023-02-15", "c": "Ángel Daniel Talavera", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (1)", "uni": 1, "m": 3465.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "23", "f": "2023-03-01", "c": "Agenda Diseño", "sexo": "", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Showroom", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (3)", "uni": 3, "m": 5940.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "24", "f": "2023-03-15", "c": "Julieta Bustos", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Efectivo", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 3960.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "25", "f": "2023-03-20", "c": "Gaspar Fuentes", "sexo": "M", "edad": "", "prov": "Río Negro", "ciudad": "Bariloche", "mp": "Criptomoneda", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2) + Pocillo Jaspeado (2) + Jarra Jaspeada (1)", "uni": 5, "m": 11007.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "26", "f": "2023-03-25", "c": "Agenda Diseño", "sexo": "", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Showroom", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 1782.0, "tipo": "B2C", "recurrente": false, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "27", "f": "2023-03-10", "c": "Eric Monetto", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (4)", "uni": 4, "m": 8000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "28", "f": "2023-04-16", "c": "Jose Esquenazi", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 4572.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "29", "f": "2023-05-10", "c": "Sandra", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "CABA", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Gris (2) + Perchero Naranja (1)", "uni": 3, "m": 11633.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "30", "f": "2023-05-20", "c": "Omar Paris", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (6)", "uni": 6, "m": 23400.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "31", "f": "2023-05-25", "c": "Omar Paris", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 4570.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "32", "f": "2023-06-01", "c": "Santiago Hall", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2) + Perchero Laca (1)", "uni": 3, "m": 7110.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "33", "f": "2023-06-05", "c": "Mauro Arroyo", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (4)", "uni": 4, "m": 9160.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "34", "f": "2023-06-10", "c": "Lucas Torres", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada/Craquelada", "prod": "Taza Jaspeada (4) + Taza Craquelada (2)", "uni": 6, "m": 13716.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "35", "f": "2023-06-15", "c": "Mariano Defelipe", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (1) + Perchero Naranja (1)", "uni": 2, "m": 10928.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "36", "f": "2023-06-20", "c": "Gregorio Fernández Socci", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (6)", "uni": 6, "m": 16830.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "37", "f": "2023-06-28", "c": "Tia Tala", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Astronauta (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "38", "f": "2023-07-01", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Astronauta (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "39", "f": "2023-07-01", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Astronauta + Postal Bimo + Postal Love Song (3)", "uni": 3, "m": 1800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "40", "f": "2023-07-01", "c": "Anónimo", "sexo": "", "edad": "50+", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero (1)", "uni": 1, "m": 480.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "41", "f": "2023-07-01", "c": "Anónimo", "sexo": "", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 7600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "42", "f": "2023-07-07", "c": "Guadalupe Talavera", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (1)", "uni": 1, "m": 8000.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "43", "f": "2023-07-07", "c": "Griselda Martinez", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (1) + Taza Jaspeada (2)", "uni": 3, "m": 14940.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "44", "f": "2023-07-08", "c": "Macu González", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Astronauta (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "45", "f": "2023-07-08", "c": "Vale Reyna", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Palta (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "46", "f": "2023-07-08", "c": "Nacho", "sexo": "M", "edad": "25-35", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Control Z (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "47", "f": "2023-07-08", "c": "Cecilia Kesman", "sexo": "F", "edad": "40-50", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 3250.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "48", "f": "2023-07-08", "c": "Eugenio", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (1)", "uni": 1, "m": 4800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "49", "f": "2023-07-08", "c": "Lara", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (1)", "uni": 1, "m": 4800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "50", "f": "2023-07-08", "c": "Jezs Garcia", "sexo": "M", "edad": "40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "Basalto", "prod": "Taza Basalto (2) + Perchero Crudo (1)", "uni": 3, "m": 11300.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "51", "f": "2023-07-09", "c": "Silvina Yzet", "sexo": "F", "edad": "40-50", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (3)", "uni": 3, "m": 13500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "52", "f": "2023-07-09", "c": "Anónimo", "sexo": "", "edad": "60", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 6500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "53", "f": "2023-07-09", "c": "Franco Gallardo", "sexo": "M", "edad": "30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 3000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "54", "f": "2023-07-09", "c": "Franco Sánchez", "sexo": "M", "edad": "30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 3000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "55", "f": "2023-07-09", "c": "Anónimo", "sexo": "", "edad": "30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Palta (1)", "uni": 1, "m": 600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "56", "f": "2023-07-09", "c": "Gino Bellido Belleti", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (2)", "uni": 2, "m": 5600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "57", "f": "2023-07-10", "c": "Papeldechicle", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 3250.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "58", "f": "2023-07-10", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 3250.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "59", "f": "2023-07-10", "c": "Maru Gaviglio", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postal Palta (1) + Postal Control Z (1)", "uni": 2, "m": 1200.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "60", "f": "2023-07-10", "c": "Juan Avila", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (1)", "uni": 1, "m": 2800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "61", "f": "2023-07-10", "c": "Nicolas Modesto Benitez", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (3)", "uni": 3, "m": 14400.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "62", "f": "2023-07-17", "c": "Alina", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Gris (3)", "uni": 3, "m": 14350.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "63", "f": "2023-08-01", "c": "Florencia Arias", "sexo": "F", "edad": "35", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Mesa S", "tcer": "", "prod": "Mesa S (1)", "uni": 1, "m": 25000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "64", "f": "2023-08-10", "c": "Iñaki Sans", "sexo": "M", "edad": "20", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (1)", "uni": 1, "m": 3250.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "65", "f": "2023-07-30", "c": "Daniel Castaño", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "San Francisco", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (1)", "uni": 1, "m": 4800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "66", "f": "2023-08-19", "c": "Lorenzo Boveri", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Craquelada", "prod": "Pocillo Craquelado (4)", "uni": 4, "m": 12000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "67", "f": "2023-08-21", "c": "Carmela (Ozono)", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (2)", "uni": 2, "m": 6000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "68", "f": "2023-08-21", "c": "Anónimo", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 3800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "69", "f": "2023-08-21", "c": "Anónimo", "sexo": "", "edad": "0-10", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Gráfica", "tcer": "", "prod": "Postales (3)", "uni": 3, "m": 1500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "70", "f": "2023-08-21", "c": "Elisa", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Jaspeada/Basalto", "prod": "Taza Basalto (2) + Taza Jaspeada (2)", "uni": 4, "m": 15200.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "71", "f": "2023-08-21", "c": "Anónimo", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (1) + Perchero Naranja (1)", "uni": 2, "m": 9800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "72", "f": "2023-08-22", "c": "Germán Baigorrí", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (1)", "uni": 1, "m": 9800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "73", "f": "2023-08-25", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (2)", "uni": 2, "m": 34500.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "74", "f": "2023-08-31", "c": "Leandro", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Pocillo Jaspeado (2) + Jarra Jaspeada (1)", "uni": 3, "m": 15750.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "75", "f": "2023-10-20", "c": "Ismael Martínez", "sexo": "M", "edad": "30-40", "prov": "Salta", "ciudad": "Salta Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo Óxido (1)", "uni": 1, "m": 5580.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "76", "f": "2023-10-29", "c": "Cecilia Pescara", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada/Basalto", "prod": "Pocillo Jaspeado (1) + Pocillo Basalto (1)", "uni": 2, "m": 7380.0, "tipo": "B2C", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "77", "f": "2023-11-25", "c": "Marisol Vitale", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (2)", "uni": 2, "m": 12564.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "78", "f": "2023-12-01", "c": "Isondy Medina", "sexo": "", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 10000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "79", "f": "2023-12-02", "c": "Iñaki Sans", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (2)", "uni": 2, "m": 8000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "80", "f": "2023-12-13", "c": "Jezs García", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (1)", "uni": 1, "m": 6280.0, "tipo": "B2C", "recurrente": false, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "81", "f": "2023-12-20", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Jarra Basalto (1) + Taza Basalto (2)", "uni": 3, "m": 20635.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "82", "f": "2023-12-20", "c": "Eliana Perno", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Taza Jaspeada (4)", "uni": 4, "m": 16672.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "83", "f": "2023-12-23", "c": "Fran Doña", "sexo": "M", "edad": "20-30", "prov": "San Luis", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (2)", "uni": 2, "m": 8244.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "84", "f": "2023-12-23", "c": "Ceci Cordi", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada/Basalto", "prod": "Pocillo Basalto (1) + Pocillo Jaspeado (1)", "uni": 2, "m": 8244.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "85", "f": "2024-05-15", "c": "Josefina Somoza", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "CABA", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (3) + Perchero Blanco (3)", "uni": 6, "m": 86608.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "86", "f": "2024-05-21", "c": "Ariana Obiedo", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "CABA", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (2)", "uni": 2, "m": 32723.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "87", "f": "2024-05-23", "c": "Francisco Semino", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (3) + Pocillo Basalto (3) + Platos (3)", "uni": 9, "m": 81603.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "88", "f": "2024-05-28", "c": "Bianca Romano Duffau", "sexo": "F", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "CABA", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1) + Jarra Basalto (1)", "uni": 2, "m": 51397.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "89", "f": "2024-05-28", "c": "Carolina Carbone", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 26200.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "90", "f": "2024-06-15", "c": "Santiago Abeledo", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (8)", "uni": 8, "m": 77040.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "91", "f": "2024-06-27", "c": "Nicolás Vignale", "sexo": "M", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 14317.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "92", "f": "2024-06-27", "c": "Paula Belivacqua", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 32899.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "93", "f": "2024-07-08", "c": "Tala Padre", "sexo": "M", "edad": "60+", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Lila (4)", "uni": 4, "m": 44540.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "94", "f": "2024-07-10", "c": "Cecilia Pescara", "sexo": "F", "edad": "30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Jarra Basalto (1) + Taza Basalto (2)", "uni": 3, "m": 49000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "95", "f": "2024-07-12", "c": "Julián López del Valle", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (3)", "uni": 3, "m": 23706.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "96", "f": "2024-07-14", "c": "Bonafide", "sexo": "", "edad": "60-70", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Mercado Pago", "canal": "Institucional", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (15) + Pocillo Basalto (15) + Jarra Basalto (8)", "uni": 38, "m": 490624.0, "tipo": "B2B", "recurrente": true, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "97", "f": "2024-07-15", "c": "Anónimo", "sexo": "", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "98", "f": "2024-07-19", "c": "Anónimo", "sexo": "", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (3)", "uni": 3, "m": 35400.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "99", "f": "2024-07-20", "c": "Yez García", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "Feria", "cat": "Cerámica", "tcer": "", "prod": "Pocillo (2)", "uni": 2, "m": 20000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "100", "f": "2024-07-20", "c": "Anónimo", "sexo": "", "edad": "40-50", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "101", "f": "2024-07-20", "c": "Valentina Perosio", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 21600.0, "tipo": "B2C", "recurrente": false, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "102", "f": "2024-08-24", "c": "Walter", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (1)", "uni": 1, "m": 11800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "103", "f": "2024-08-25", "c": "Paulina", "sexo": "F", "edad": "40-50", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (3)", "uni": 3, "m": 35400.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "104", "f": "2024-08-26", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 21600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "105", "f": "2024-08-27", "c": "Anónimo", "sexo": "", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "106", "f": "2024-08-28", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 10800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "107", "f": "2024-08-29", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 21600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "108", "f": "2024-09-01", "c": "Aconquija", "sexo": "", "edad": "50-60", "prov": "Tucumán", "ciudad": "San Miguel de Tucumán", "mp": "Transferencia", "canal": "Institucional", "cat": "Cerámica", "tcer": "Basalto", "prod": "Jarra Basalto (2) + Pocillo Basalto (6)", "uni": 8, "m": 115200.0, "tipo": "B2B", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "109", "f": "2024-09-01", "c": "Costanza Guillamondegui", "sexo": "F", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "110", "f": "2024-07-24", "c": "José Jiménez", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (2)", "uni": 2, "m": 33569.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "111", "f": "2024-09-05", "c": "Alexis", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 10800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "112", "f": "2024-09-06", "c": "Megan Davobe", "sexo": "F", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "", "mp": "Depósito bancario", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Azul (2) + Perchero Crema (2) + Perchero Negro (2) + Perchero Verde (2)", "uni": 8, "m": 107300.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "113", "f": "2024-07-27", "c": "Manuel Bracchi", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "Basalto", "prod": "Perchero Naranja (1) + Taza Basalto (2)", "uni": 3, "m": 45281.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "114", "f": "2024-09-10", "c": "Alejandro Garrido", "sexo": "M", "edad": "", "prov": "Internacional", "ciudad": "España", "mp": "Western Union", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (2) + Perchero Azul (1) + Perchero Crudo (1) + Perchero Naranja (2)", "uni": 6, "m": 100341.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "115", "f": "2024-09-12", "c": "Yanina", "sexo": "F", "edad": "50-60", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Perchero", "tcer": "", "prod": "Perchero Turquesa (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "116", "f": "2024-09-15", "c": "Juan Scarpatti", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "", "prod": "Taza Personalizada (24)", "uni": 24, "m": 244000.0, "tipo": "B2B", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "117", "f": "2024-09-20", "c": "Marcela", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "Presencial", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2) + Perchero Blanco (1)", "uni": 3, "m": 35400.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "118", "f": "2024-09-22", "c": "Rocío Hidalgo", "sexo": "F", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "119", "f": "2024-09-25", "c": "Macarena Carrara", "sexo": "F", "edad": "30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2) + Jarra Basalto (1)", "uni": 3, "m": 56900.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "120", "f": "2024-09-28", "c": "Octavio Luchinelli", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Mesa S", "tcer": "", "prod": "Mesa S Lila (1) + Perchero Naranja (2)", "uni": 3, "m": 220590.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "121", "f": "2024-09-08", "c": "Carla Tatasciore", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "GoCuotas", "canal": "Tienda Nube", "cat": "Mesa S", "tcer": "", "prod": "Mesa S (1)", "uni": 1, "m": 237434.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "122", "f": "2024-10-01", "c": "Juan Ignacio Olazabal", "sexo": "M", "edad": "30-40", "prov": "Buenos Aires", "ciudad": "", "mp": "Depósito bancario", "canal": "Presencial", "cat": "Mesa S", "tcer": "Basalto", "prod": "Mesa S Azul (1) + Jarra Basalto (1)", "uni": 2, "m": 251800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "123", "f": "2024-10-05", "c": "María Edith Expósito", "sexo": "F", "edad": "60-70", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (6)", "uni": 6, "m": 65000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "124", "f": "2024-10-08", "c": "Iñaki Sans", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1)", "uni": 1, "m": 11500.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "125", "f": "2024-10-10", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (4)", "uni": 4, "m": 41320.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "126", "f": "2024-10-12", "c": "Juan Scarpatti", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Jaspeada", "prod": "Jarra Jaspeada (2)", "uni": 2, "m": 40000.0, "tipo": "B2B", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "127", "f": "2024-08-24", "c": "Anónimo", "sexo": "", "edad": "20-30", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (1)", "uni": 1, "m": 10300.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "128", "f": "2024-08-30", "c": "Anónimo", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (2)", "uni": 2, "m": 20500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "129", "f": "2024-08-30", "c": "Anónimo", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "", "mp": "Efectivo", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (1) + Perchero Naranja (1)", "uni": 2, "m": 23600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "130", "f": "2024-09-08", "c": "Carla Tatasciore", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "GoCuotas", "canal": "Tienda Nube", "cat": "Mesa S", "tcer": "", "prod": "Mesa S (color a definir)", "uni": 1, "m": 237434.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "131", "f": "2024-09-08", "c": "Santiago Bustos", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Mesa S", "tcer": "", "prod": "Mesa S Verde Oliva (1)", "uni": 1, "m": 74000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "132", "f": "2024-09-08", "c": "Gonzalo Talavera", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Mesa S", "tcer": "", "prod": "Mesa S Verde Oliva (1)", "uni": 1, "m": 74000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "133", "f": "2024-09-13", "c": "Anónimo", "sexo": "", "edad": "50-60", "prov": "Buenos Aires", "ciudad": "", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (2)", "uni": 2, "m": 23580.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "134", "f": "2024-09-14", "c": "Omar Paris", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (1)", "uni": 1, "m": 11780.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "135", "f": "2024-09-14", "c": "Anónimo", "sexo": "F", "edad": "20-30", "prov": "Entre Ríos", "ciudad": "Paraná", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (1)", "uni": 1, "m": 10300.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "136", "f": "2024-09-15", "c": "Ramiro Martoglio", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 23080.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "137", "f": "2024-09-15", "c": "Anónimo", "sexo": "F", "edad": "20-30", "prov": "Entre Ríos", "ciudad": "Paraná", "mp": "Efectivo", "canal": "Feria", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (1)", "uni": 1, "m": 11800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "138", "f": "2024-09-15", "c": "Anónimo", "sexo": "F", "edad": "30-40", "prov": "Entre Ríos", "ciudad": "Paraná", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Jarra Basalto (1) + Taza Basalto (4)", "uni": 5, "m": 78800.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "139", "f": "2024-09-15", "c": "Anónimo", "sexo": "F", "edad": "20-30", "prov": "Entre Ríos", "ciudad": "Paraná", "mp": "Transferencia", "canal": "Feria", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 23000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "140", "f": "2024-09-15", "c": "Anónimo", "sexo": "M", "edad": "40-50", "prov": "Entre Ríos", "ciudad": "Paraná", "mp": "Transferencia", "canal": "Feria", "cat": "Perchero", "tcer": "Basalto", "prod": "Pocillo Basalto (2) + Perchero Blanco (1)", "uni": 3, "m": 32100.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "141", "f": "2024-09-17", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2)", "uni": 2, "m": 23089.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "142", "f": "2024-09-20", "c": "Luna Picón", "sexo": "F", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "CABA", "mp": "Canje", "canal": "Canje contenido", "cat": "Mesa S", "tcer": "", "prod": "Mesa S Plata (1)", "uni": 1, "m": 0.0, "tipo": "Canje", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "143", "f": "2024-10-14", "c": "Alejandro García", "sexo": "M", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (1)", "uni": 1, "m": 15855.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "144", "f": "2024-10-14", "c": "Elena Vagliera", "sexo": "F", "edad": "60-70", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (1) + Perchero Negro (1) + Perchero Naranja (1)", "uni": 3, "m": 35400.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "145", "f": "2024-10-17", "c": "Gonzalo Talavera", "sexo": "M", "edad": "", "prov": "Salta", "ciudad": "Salta Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (6)", "uni": 6, "m": 50000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "146", "f": "2024-11-14", "c": "Ismael Martinez", "sexo": "M", "edad": "30-40", "prov": "Salta", "ciudad": "Salta Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (1) + Pocillo Basalto (1)", "uni": 2, "m": 21874.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "147", "f": "2024-11-14", "c": "Ignacio Jimenez", "sexo": "M", "edad": "30-40", "prov": "Buenos Aires", "ciudad": "", "mp": "Crédito", "canal": "Tienda Nube", "cat": "Mesa S", "tcer": "", "prod": "Mesa S Bordó (1)", "uni": 1, "m": 240723.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "148", "f": "2024-11-22", "c": "Paula Sofia Pechin", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro Microtexturado (3)", "uni": 3, "m": 40497.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "149", "f": "2024-12-03", "c": "Coqui", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (10) + Pocillo Basalto (10)", "uni": 20, "m": 206600.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "150", "f": "2024-12-15", "c": "Bonafide", "sexo": "", "edad": "50-60", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Transferencia", "canal": "Institucional", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (8) + Pocillo Basalto (8)", "uni": 16, "m": 192340.0, "tipo": "B2B", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "151", "f": "2024-12-20", "c": "Daniela Vanetta", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 29118.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "152", "f": "2025-01-10", "c": "Ana Belén Robert", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (3)", "uni": 3, "m": 39797.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "153", "f": "2025-01-15", "c": "Sánchez Julieta", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "154", "f": "2025-01-20", "c": "Jalil Ramiro", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (6)", "uni": 6, "m": 68514.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "155", "f": "2025-01-25", "c": "Del Boca María Cecilia", "sexo": "F", "edad": "", "prov": "La Pampa", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Gris Perla (5) + Perchero Gris Ral (5)", "uni": 10, "m": 130872.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "156", "f": "2025-02-01", "c": "Lorenzo Dosa Federico", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "157", "f": "2025-03-06", "c": "Casa Capital", "sexo": "", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Cerámica", "tcer": "", "prod": "Tazas Personalizadas (8)", "uni": 8, "m": 120000.0, "tipo": "B2B", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "158", "f": "2025-03-15", "c": "Arata Posse Faustino", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "159", "f": "2025-03-20", "c": "Tedesco Claudia", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "160", "f": "2025-03-25", "c": "Alegre Sol", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "161", "f": "2025-03-28", "c": "Herrera Yamila", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 34257.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "162", "f": "2025-04-01", "c": "Gonzalo Talavera", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (3)", "uni": 3, "m": 0.0, "tipo": "Canje", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "163", "f": "2025-04-05", "c": "Servin Lucas", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "", "mp": "Mercado Pago", "canal": "Mercado Libre", "cat": "Perchero", "tcer": "", "prod": "Perchero Blanco (6)", "uni": 6, "m": 47417.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "164", "f": "2025-04-08", "c": "Guadalupe Talavera", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (3)", "uni": 3, "m": 50398.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "165", "f": "2025-04-10", "c": "Rodríguez Prior Agustina", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Negro (1) + Perchero Naranja (1)", "uni": 2, "m": 46080.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "166", "f": "2025-05-14", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (6)", "uni": 6, "m": 84000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "167", "f": "2025-05-20", "c": "Rodrigo Toranzo", "sexo": "M", "edad": "20-30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (2) + Pocillo Basalto (2)", "uni": 4, "m": 55200.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "168", "f": "2025-06-01", "c": "Pablo Scarpatti", "sexo": "M", "edad": "40-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "Presencial", "cat": "Cerámica", "tcer": "Basalto", "prod": "Jarra Basalto (2)", "uni": 2, "m": 94614.0, "tipo": "B2B", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "169", "f": "2025-06-10", "c": "Bonafide", "sexo": "", "edad": "", "prov": "Córdoba", "ciudad": "Bell Ville", "mp": "Transferencia", "canal": "Institucional", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (12)", "uni": 12, "m": 180000.0, "tipo": "B2B", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "170", "f": "2025-06-26", "c": "Mara Chávez", "sexo": "F", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (1)", "uni": 1, "m": 18900.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "171", "f": "2025-09-27", "c": "Santiago Carrara", "sexo": "M", "edad": "30", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Pocillo Basalto (2)", "uni": 2, "m": 28165.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "172", "f": "2025-10-16", "c": "Marisa Cordi", "sexo": "F", "edad": "50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "WhatsApp/Directo", "cat": "Perchero", "tcer": "", "prod": "Perchero Naranja (2)", "uni": 2, "m": 52200.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "173", "f": "2025-12-16", "c": "Franco Marini", "sexo": "M", "edad": "30-50", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Uala", "canal": "Instagram", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (3)", "uni": 3, "m": 57600.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "Instagram", "anulada": false},
  {"n": "174", "f": "2025-12-18", "c": "Carla Vázquez", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "WhatsApp/Directo", "cat": "Ménsula", "tcer": "", "prod": "Perchero Rojo (2) + Ménsulas Amarillas (4 pares)", "uni": 2, "m": 186000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "175", "f": "2026-03-13", "c": "Ismael Martínez", "sexo": "M", "edad": "30-40", "prov": "Salta", "ciudad": "Salta Capital", "mp": "Mercado Pago", "canal": "Presencial", "cat": "Perchero", "tcer": "", "prod": "Perchero Crudo (1)", "uni": 1, "m": 37000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "Recomendación", "anulada": false},
  {"n": "176", "f": "2026-03-30", "c": "Guadalupe Talavera", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 65000.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "177", "f": "2026-03-31", "c": "Maximiliano Navarro", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 69102.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "178", "f": "2026-03-31", "c": "Tomás Altina", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 66470.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "179", "f": "2026-03-31", "c": "Melina Ávalos", "sexo": "F", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 69972.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "180", "f": "2026-03-31", "c": "Victoria Martina Brouchy", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 63472.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "181", "f": "2026-03-31", "c": "Santiago Carrara", "sexo": "M", "edad": "", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 58500.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "182", "f": "2026-04-08", "c": "Florencia Harari", "sexo": "F", "edad": "30-40", "prov": "Buenos Aires", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 63472.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "183", "f": "2026-04-09", "c": "Omar Beltrán", "sexo": "M", "edad": "30-40", "prov": "Buenos Aires", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 70270.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "184", "f": "2026-04-09", "c": "Laura Cordi", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 58500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "185", "f": "2026-04-09", "c": "Pedro Ruiz Funes", "sexo": "M", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Efectivo", "canal": "WhatsApp/Directo", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 58500.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "186", "f": "2026-04-13", "c": "Daniel Tomaselli", "sexo": "M", "edad": "", "prov": "Mendoza", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 87512.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "187", "f": "2026-04-18", "c": "Manuela Santa Clara", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 80481.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "188", "f": "2026-04-19", "c": "Victoria Rabinovich", "sexo": "F", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 84102.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "189", "f": "2026-04-21", "c": "Maximiliano Ledesma", "sexo": "M", "edad": "", "prov": "Buenos Aires", "ciudad": "", "mp": "Pago Nube", "canal": "Tienda Nube", "cat": "Reloj Galaxia", "tcer": "", "prod": "Reloj Galaxia (1)", "uni": 1, "m": 80481.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "190", "f": "2026-04-22", "c": "Cecilia Cordi", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Ménsula", "tcer": "", "prod": "Ménsulas (2 pares)", "uni": 1, "m": 92000.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "191", "f": "2026-04-25", "c": "Florencia Arias", "sexo": "F", "edad": "30-40", "prov": "Córdoba", "ciudad": "Córdoba Capital", "mp": "Transferencia", "canal": "WhatsApp/Directo", "cat": "Cerámica", "tcer": "Basalto", "prod": "Taza Basalto (4)", "uni": 4, "m": 92310.0, "tipo": "B2C", "recurrente": true, "primera": false, "encargo": false, "sena": false, "conocio": "", "anulada": false},
  {"n": "192", "f": "2024-12-19", "c": "Mia Siccardi", "sexo": "F", "edad": "20-30", "prov": "Buenos Aires", "ciudad": "Gran Buenos Aires", "mp": "Mercado Pago", "canal": "Tienda Nube", "cat": "Mesa S", "tcer": "", "prod": "Mesa S (1)", "uni": 1, "m": 199440.0, "tipo": "B2C", "recurrente": false, "primera": true, "encargo": false, "sena": false, "conocio": "", "anulada": false}
];

function parseVenta(text) {
  const get = (...keys) => {
    for (const k of keys) {
      const m = text.match(new RegExp(k + '[^:\\n]*:\\s*([^\\n]+)', 'i'));
      if (m) return m[1].replace(/\*/g, '').trim();
    }
    return '';
  };
  const numM = text.match(/VENTA\s*N[ºo°]?\s*:?\s*(\d+)/i);
  const mRaw = get('Monto total', 'Monto').replace(/[$\.]/g, '').replace(',', '.').split(/\s/)[0];
  const pedRaw = get('Pedido');
  const catMap = [
    ['reloj', 'Reloj Galaxia'], ['mesa', 'Mesa S'], ['mensul', 'Mensula'],
    ['perchero', 'Perchero'], ['taza', 'Ceramica'], ['pocillo', 'Ceramica'],
    ['jarra', 'Ceramica'], ['postal', 'Grafica']
  ];
  const catMapDisplay = {
    'Reloj Galaxia': 'Reloj Galaxia', 'Mesa S': 'Mesa S', 'Mensula': 'Ménsula',
    'Perchero': 'Perchero', 'Ceramica': 'Cerámica', 'Grafica': 'Gráfica'
  };
  let catKey = 'Otro';
  for (const [k, v] of catMap) if (pedRaw.toLowerCase().includes(k)) { catKey = v; break; }
  const cat = catMapDisplay[catKey] || catKey;

  const provRaw = get('Provincia').split(/[-–]/)[0].trim();
  const provMap = {
    'cordoba': 'Córdoba', 'buenos aires': 'Buenos Aires', 'salta': 'Salta',
    'mendoza': 'Mendoza', 'entre rios': 'Entre Ríos', 'entre r': 'Entre Ríos',
    'la pampa': 'La Pampa', 'rio negro': 'Río Negro', 'caba': 'CABA'
  };
  let prov = provRaw;
  for (const [k, v] of Object.entries(provMap)) {
    if (provRaw.toLowerCase().includes(k)) { prov = v; break; }
  }

  const canalRaw = get('Canal de venta').toLowerCase();
  let canal = '';
  if (/tienda nube/.test(canalRaw)) canal = 'Tienda Nube';
  else if (/mercado libre/.test(canalRaw)) canal = 'Mercado Libre';
  else if (/whatsapp/.test(canalRaw)) canal = 'WhatsApp/Directo';
  else if (/feria/.test(canalRaw)) canal = 'Feria';
  else if (/instagram/.test(canalRaw)) canal = 'Instagram';
  else if (/presencial/.test(canalRaw)) canal = 'Presencial';
  else if (/institucional/.test(canalRaw)) canal = 'Institucional';
  else if (/showroom/.test(canalRaw)) canal = 'Showroom';
  else canal = get('Canal de venta');

  const conocioRaw = get('Conocio', 'Como nos conocio').toLowerCase();
  let conocio = '';
  if (/instagram/.test(conocioRaw)) conocio = 'Instagram';
  else if (/google/.test(conocioRaw)) conocio = 'Google';
  else if (/mercado libre/.test(conocioRaw)) conocio = 'Mercado Libre';
  else if (/recomend/.test(conocioRaw)) conocio = 'Recomendación';
  else if (/ya nos conoc/.test(conocioRaw)) conocio = 'Ya nos conocía';
  else if (/tiktok/.test(conocioRaw)) conocio = 'TikTok';
  else if (conocioRaw && conocioRaw !== '-') conocio = get('Conocio', 'Como nos conocio');

  return {
    n: numM ? numM[1] : '',
    f: new Date().toISOString().split('T')[0],
    c: get('Nombre'),
    sexo: get('Sexo').split(/[\s/]/)[0].toUpperCase().slice(0, 1) || '',
    edad: get('Rango etario'),
    prov, ciudad: get('Ciudad'),
    mp: get('Medio de pago'),
    canal, cat,
    tcer: get('Tipo ceramica', 'Tipo cer'),
    prod: pedRaw,
    uni: parseInt(get('Unidades total')) || 0,
    m: parseFloat(mRaw) || 0,
    tipo: (get('Tipo de venta') || 'B2C').toUpperCase(),
    recurrente: /^s[ií]/i.test(get('Cliente recurrente')),
    primera: /^s[ií]/i.test(get('Primera compra')),
    encargo: /^s[ií]/i.test(get('Por encargo')),
    sena: /^s[ií]/i.test(get('Sena', 'Seña')),
    conocio, anulada: false,
  };
}

const TEMPLATE = `VENTA Nº: \nFecha: \n\n— PRODUCTO —\nPedido + (cantidad): \nTipo ceramica (si aplica): \nUnidades total: \nMonto total: \nPor encargo (Si/No): \nSena (Si/No): \n\n— CLIENTE —\nNombre: \nSexo (M/F/Otro): \nRango etario (ej: 30-40): \nPrimera compra (Si/No): \nCliente recurrente (Si/No): \nConocio: Instagram / TikTok / Google / Mercado Libre / Recomendacion / Ya nos conocia / Otro\n\n— ENVIO Y ORIGEN —\nCanal de venta: Tienda Nube / Mercado Libre / WhatsApp / Feria / Presencial / Instagram / Institucional\nMedio de pago: \nProvincia: \nCiudad: \nTipo de venta (B2C/B2B/Canje): `;

const ACC = "#C8A96E", DARK = "#0F0F0F", MID = "#1E1E1E", CARD = "#252525", BORDER = "#2E2E2E", TEXT = "#E8D5A3", MUTED = "#666";
const COLORS = ["#C8A96E","#8B6914","#E8D5A3","#5C4A1E","#F0E8D0","#A07840","#3D2F10","#D4B483","#6B5020","#FFE4A0","#9B7B3A","#BFA060"];
const CAT_COLORS = {"Cerámica":"#A07840","Perchero":"#C8A96E","Reloj Galaxia":"#F0E8D0","Mesa S":"#8B6914","Gráfica":"#5C4A1E","Ménsula":"#D4B483","Otro":"#444"};
const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n/1000)}K` : `$${Math.round(n)}`;
const fmtFull = n => `$${Math.round(n).toLocaleString('es-AR')}`;

const TT = ({active, payload, label}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'#1A1A1A', border:`1px solid ${ACC}44`, borderRadius:8, padding:'8px 14px'}}>
      <p style={{margin:0, color:'#888', fontSize:11, fontFamily:'DM Mono'}}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{margin:'2px 0 0', color:ACC, fontSize:14, fontWeight:700}}>{typeof p.value === 'number' && p.value > 500 ? fmtFull(p.value) : p.value}</p>)}
    </div>
  );
};

const KPI = ({label, value, sub, hi}) => (
  <div style={{background: hi ? `linear-gradient(135deg,${ACC}18,${ACC}05)` : CARD, border:`1px solid ${hi ? ACC : BORDER}`, borderRadius:12, padding:'16px 20px', display:'flex', flexDirection:'column', gap:3}}>
    <span style={{fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color: hi ? ACC : MUTED, fontFamily:"'DM Mono',monospace"}}>{label}</span>
    <span style={{fontSize:24, fontWeight:700, color: hi ? ACC : TEXT, fontFamily:"'Playfair Display',serif", lineHeight:1.1}}>{value}</span>
    {sub && <span style={{fontSize:10, color:MUTED, fontFamily:"'DM Mono',monospace"}}>{sub}</span>}
  </div>
);

const Sec = ({children}) => (
  <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
    <div style={{width:3, height:18, background:ACC, borderRadius:2}}/>
    <h2 style={{margin:0, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', color:ACC, fontFamily:"'DM Mono',monospace"}}>{children}</h2>
  </div>
);

const Panel = ({children, style={}}) => (
  <div style={{background:CARD, border:`1px solid ${BORDER}`, borderRadius:12, padding:20, ...style}}>{children}</div>
);

const BarH = (data) => (
  <div style={{display:'flex', flexDirection:'column', gap:6, marginTop:6}}>
    {data.map((p,i) => (
      <div key={i}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:2}}>
          <span style={{fontSize:11, color:'#aaa', fontFamily:'DM Mono', maxWidth:170, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.name}</span>
          <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono', flexShrink:0, marginLeft:8}}>{typeof p.value === 'number' && p.value > 500 ? fmt(p.value) : p.value}</span>
        </div>
        <div style={{height:4, background:'#2A2A2A', borderRadius:2}}>
          <div style={{height:'100%', width:`${(p.value/data[0].value)*100}%`, background:COLORS[i%COLORS.length], borderRadius:2}}/>
        </div>
      </div>
    ))}
  </div>
);

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [fy, setFy] = useState('todos');
  const [fc, setFc] = useState('todas');
  const [ft, setFt] = useState('todos');
  const [ventas, setVentas] = useState(RAW);
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState(false);

  const handleParse = () => {
    setErr(''); setSaved(false);
    if (!input.includes('VENTA')) { setErr('No se detectó "VENTA Nº" en el mensaje.'); setParsed(null); return; }
    const p = parseVenta(input);
    if (!p.c) { setErr('No se pudo leer el nombre del cliente.'); return; }
    setParsed(p);
  };

  const handleSave = () => {
    setVentas(prev => {
      const idx = prev.findIndex(v => String(v.n) === String(parsed.n));
      if (idx >= 0) { const c = [...prev]; c[idx] = parsed; return c; }
      return [...prev, parsed].sort((a, b) => String(a.n).localeCompare(String(b.n), undefined, {numeric: true}));
    });
    setSaved(true); setInput(''); setParsed(null);
  };

  const years = useMemo(() => [...new Set(RAW.map(v => v.f.slice(0,4)))].sort(), []);
  const cats = useMemo(() => [...new Set(RAW.map(v => v.cat))].sort(), []);

  const filtered = useMemo(() => ventas.filter(v => {
    if (v.anulada) return false;
    if (fy !== 'todos' && v.f.slice(0,4) !== fy) return false;
    if (fc !== 'todas' && v.cat !== fc) return false;
    if (ft !== 'todos' && v.tipo !== ft) return false;
    return true;
  }), [ventas, fy, fc, ft]);

  const conM = useMemo(() => filtered.filter(v => v.m > 0), [filtered]);
  const totalM = useMemo(() => conM.reduce((s,v) => s+v.m, 0), [conM]);
  const totalUni = useMemo(() => filtered.reduce((s,v) => s+v.uni, 0), [filtered]);
  const ticketProm = useMemo(() => conM.length ? totalM/conM.length : 0, [totalM, conM]);

  const byKey = useCallback((arr, key, filterEmpty=false) => {
    const m = {};
    arr.forEach(v => { const k = v[key] || 'Sin dato'; if (filterEmpty && !v[key]) return; m[k] = (m[k]||0)+1; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({name, value}));
  }, []);

  const byCat = useMemo(() => byKey(filtered, 'cat'), [filtered, byKey]);
  const byProv = useMemo(() => byKey(filtered, 'prov'), [filtered, byKey]);
  const byCanal = useMemo(() => byKey(filtered, 'canal').slice(0,8), [filtered, byKey]);
  const byMP = useMemo(() => byKey(conM, 'mp').slice(0,7), [conM, byKey]);
  const bySexo = useMemo(() => byKey(filtered, 'sexo', true), [filtered, byKey]);
  const byEdad = useMemo(() => byKey(filtered, 'edad', true).slice(0,8), [filtered, byKey]);
  const byTipo = useMemo(() => byKey(filtered, 'tipo'), [filtered, byKey]);
  const byTipoCer = useMemo(() => { const a = filtered.filter(v => v.cat === 'Cerámica' && v.tcer); return byKey(a, 'tcer').slice(0,6); }, [filtered, byKey]);
  const byConocio = useMemo(() => byKey(filtered, 'conocio', true), [filtered, byKey]);

  const byYear = useMemo(() => {
    const m = {};
    ventas.filter(v => !v.anulada).forEach(v => {
      const y = v.f.slice(0,4);
      if (!m[y]) m[y] = {year:y, ventas:0, ingresos:0, unidades:0};
      m[y].ventas++; m[y].unidades += v.uni; if (v.m > 0) m[y].ingresos += v.m;
    });
    return Object.values(m).sort((a,b) => a.year.localeCompare(b.year));
  }, [ventas]);

  const byMonth = useMemo(() => {
    const m = {};
    filtered.forEach(v => {
      const mes = v.f.slice(0,7);
      if (!m[mes]) m[mes] = {mes, ventas:0, unidades:0};
      m[mes].ventas++; m[mes].unidades += v.uni;
    });
    const L = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return Object.values(m).sort((a,b) => a.mes.localeCompare(b.mes))
      .map(d => ({...d, mes: d.mes.replace(/(\d{4})-(\d{2})/, (_, y, mo) => `${L[+mo]}'${y.slice(2)}`)}));
  }, [filtered]);

  const catIngresos = useMemo(() => {
    const m = {}; conM.forEach(v => { m[v.cat] = (m[v.cat]||0)+v.m; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({name, value}));
  }, [conM]);

  const catUnidades = useMemo(() => {
    const m = {}; filtered.forEach(v => { m[v.cat] = (m[v.cat]||0)+v.uni; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).map(([name, value]) => ({name, value}));
  }, [filtered]);

  const recurrentes = useMemo(() => [
    {name:'Recurrente', value: filtered.filter(v => v.recurrente).length},
    {name:'Nuevo', value: filtered.filter(v => !v.recurrente).length}
  ], [filtered]);

  const topClientes = useMemo(() => {
    const m = {};
    conM.forEach(v => { if (!m[v.c]) m[v.c] = {name:v.c, compras:0, total:0}; m[v.c].compras++; m[v.c].total += v.m; });
    return Object.values(m).sort((a,b) => b.total-a.total).slice(0,8);
  }, [conM]);

  const TABS = [{id:'dashboard',label:'Dashboard'},{id:'clientes',label:'Clientes'},{id:'agregar',label:'+ Nueva venta'},{id:'base',label:'Base de datos'}];
  const FB = ({val, cur, set, label}) => (
    <button onClick={() => set(val)} style={{background: cur===val ? `${ACC}22` : 'transparent', color: cur===val ? ACC : '#555', border:`1px solid ${cur===val ? ACC : BORDER}`, borderRadius:5, padding:'4px 10px', cursor:'pointer', fontSize:11, fontFamily:'DM Mono'}}>{label}</button>
  );

  return (
    <div style={{minHeight:'100vh', background:DARK, color:TEXT, fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      <div style={{borderBottom:`1px solid ${BORDER}`, padding:'18px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
        <div>
          <h1 style={{margin:0, fontSize:20, fontFamily:"'Playfair Display',serif", fontWeight:700}}>Dialgo <span style={{color:ACC}}>Ventas</span></h1>
          <p style={{margin:'2px 0 0', fontSize:10, color:'#444', fontFamily:"'DM Mono',monospace", letterSpacing:'0.08em'}}>HISTORIAL 2022–2026 · {ventas.length} VENTAS REGISTRADAS</p>
        </div>
        <div style={{display:'flex', gap:6}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{background: tab===t.id ? ACC : 'transparent', color: tab===t.id ? DARK : '#777', border:`1px solid ${tab===t.id ? ACC : BORDER}`, borderRadius:7, padding:'7px 14px', cursor:'pointer', fontSize:11, fontFamily:"'DM Mono',monospace"}}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:'24px 28px', maxWidth:1160, margin:'0 auto'}}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div style={{display:'flex', flexDirection:'column', gap:22}}>
            <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
              <span style={{fontSize:9, color:MUTED, fontFamily:'DM Mono', letterSpacing:'0.1em'}}>AÑO:</span>
              <FB val="todos" cur={fy} set={setFy} label="Todos"/>
              {years.map(y => <FB key={y} val={y} cur={fy} set={setFy} label={y}/>)}
              <span style={{fontSize:9, color:MUTED, fontFamily:'DM Mono', marginLeft:8, letterSpacing:'0.1em'}}>CAT:</span>
              <FB val="todas" cur={fc} set={setFc} label="Todas"/>
              {cats.map(c => <FB key={c} val={c} cur={fc} set={setFc} label={c}/>)}
              <span style={{fontSize:9, color:MUTED, fontFamily:'DM Mono', marginLeft:8, letterSpacing:'0.1em'}}>TIPO:</span>
              {['todos','B2C','B2B','Canje'].map(t => <FB key={t} val={t} cur={ft} set={setFt} label={t==='todos'?'Todos':t}/>)}
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10}}>
              <KPI label="Ingresos registrados" value={fmt(totalM)} sub={`${conM.length} ventas con monto`} hi/>
              <KPI label="Total ventas" value={filtered.length} sub={`${ventas.length} en historial`}/>
              <KPI label="Unidades vendidas" value={totalUni.toLocaleString('es-AR')} sub="piezas totales"/>
              <KPI label="Ticket promedio" value={fmt(ticketProm)} sub="por transacción"/>
              <KPI label="Clientes únicos" value={new Set(filtered.map(v => v.c)).size} sub="en el período"/>
            </div>

            <Panel>
              <Sec>Evolución anual</Sec>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={byYear} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                  <XAxis dataKey="year" tick={{fill:MUTED, fontSize:11, fontFamily:'DM Mono'}}/>
                  <YAxis yAxisId="v" tick={{fill:MUTED, fontSize:10}} width={25}/>
                  <YAxis yAxisId="u" tick={{fill:MUTED, fontSize:10}} width={30} tickFormatter={v => `${v}u`}/>
                  <YAxis yAxisId="i" orientation="right" tick={{fill:MUTED, fontSize:10}} width={58} tickFormatter={v => fmt(v)}/>
                  <Tooltip content={<TT/>}/>
                  <Bar yAxisId="i" dataKey="ingresos" fill={`${ACC}28`} radius={[4,4,0,0]} name="Ingresos"/>
                  <Bar yAxisId="u" dataKey="unidades" fill={`${ACC}55`} radius={[4,4,0,0]} name="Unidades"/>
                  <Bar yAxisId="v" dataKey="ventas" fill={ACC} radius={[4,4,0,0]} name="Ventas"/>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {byMonth.length > 2 && (
              <Panel>
                <Sec>Evolución mensual</Sec>
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={byMonth}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACC} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={ACC} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
                    <XAxis dataKey="mes" tick={{fill:MUTED, fontSize:9, fontFamily:'DM Mono'}}/>
                    <YAxis yAxisId="v" tick={{fill:MUTED, fontSize:10}} width={20}/>
                    <Tooltip content={<TT/>}/>
                    <Area yAxisId="v" type="monotone" dataKey="ventas" stroke={ACC} strokeWidth={2} fill="url(#g1)" name="Ventas"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>
            )}

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <Panel>
                <Sec>Categoría de producto</Sec>
                <div style={{display:'flex', gap:14, alignItems:'center'}}>
                  <ResponsiveContainer width={145} height={145}>
                    <PieChart>
                      <Pie data={byCat} cx="50%" cy="50%" innerRadius={36} outerRadius={65} paddingAngle={3} dataKey="value">
                        {byCat.map((_,i) => <Cell key={i} fill={CAT_COLORS[byCat[i].name]||COLORS[i]}/>)}
                      </Pie>
                      <Tooltip content={<TT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:6}}>
                    {byCat.map((p,i) => (
                      <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center', gap:7}}>
                          <div style={{width:7, height:7, borderRadius:2, background:CAT_COLORS[p.name]||COLORS[i], flexShrink:0}}/>
                          <span style={{fontSize:11, color:'#bbb', fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono'}}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
              <Panel>
                <Sec>Distribución geográfica</Sec>
                <div style={{display:'flex', gap:14, alignItems:'center'}}>
                  <ResponsiveContainer width={145} height={145}>
                    <PieChart>
                      <Pie data={byProv.slice(0,7)} cx="50%" cy="50%" innerRadius={36} outerRadius={65} paddingAngle={3} dataKey="value">
                        {byProv.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Pie>
                      <Tooltip content={<TT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:6}}>
                    {byProv.slice(0,7).map((p,i) => (
                      <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center', gap:7}}>
                          <div style={{width:7, height:7, borderRadius:2, background:COLORS[i%COLORS.length], flexShrink:0}}/>
                          <span style={{fontSize:11, color:'#bbb', fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono'}}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <Panel>
                <Sec>Ingresos por categoría</Sec>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={catIngresos} layout="vertical">
                    <XAxis type="number" tick={{fill:MUTED, fontSize:10}} tickFormatter={v => fmt(v)}/>
                    <YAxis dataKey="name" type="category" tick={{fill:'#aaa', fontSize:11, fontFamily:'DM Mono'}} width={110}/>
                    <Tooltip content={<TT/>}/>
                    <Bar dataKey="value" radius={[0,6,6,0]}>{catIngresos.map((e,i) => <Cell key={i} fill={CAT_COLORS[e.name]||COLORS[i]}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <Sec>Unidades vendidas por categoría</Sec>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={catUnidades} layout="vertical">
                    <XAxis type="number" tick={{fill:MUTED, fontSize:10}}/>
                    <YAxis dataKey="name" type="category" tick={{fill:'#aaa', fontSize:11, fontFamily:'DM Mono'}} width={110}/>
                    <Tooltip content={<TT/>}/>
                    <Bar dataKey="value" radius={[0,6,6,0]}>{catUnidades.map((e,i) => <Cell key={i} fill={CAT_COLORS[e.name]||COLORS[i]}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <Panel><Sec>Canal de venta</Sec>{BarH(byCanal)}</Panel>
              <Panel><Sec>Medio de pago</Sec>{BarH(byMP)}</Panel>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
              <Panel>
                <Sec>Tipo de venta</Sec>
                <div style={{display:'flex', gap:12, alignItems:'center', marginTop:8}}>
                  <ResponsiveContainer width={110} height={110}>
                    <PieChart>
                      <Pie data={byTipo} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={4} dataKey="value">
                        {byTipo.map((_,i) => <Cell key={i} fill={COLORS[i]}/>)}
                      </Pie>
                      <Tooltip content={<TT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:7}}>
                    {byTipo.map((p,i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center', gap:6}}>
                          <div style={{width:7, height:7, borderRadius:2, background:COLORS[i], flexShrink:0}}/>
                          <span style={{fontSize:11, color:'#aaa', fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono'}}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
              <Panel>
                <Sec>Tipo cerámica</Sec>
                {byTipoCer.length > 0 ? BarH(byTipoCer) : <p style={{color:MUTED, fontSize:11, fontFamily:'DM Mono', margin:'8px 0'}}>Filtrá por "Cerámica" para ver este dato</p>}
              </Panel>
              <Panel>
                <Sec>Nuevos vs recurrentes</Sec>
                <div style={{display:'flex', gap:12, alignItems:'center', marginTop:8}}>
                  <ResponsiveContainer width={110} height={110}>
                    <PieChart>
                      <Pie data={recurrentes} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={4} dataKey="value">
                        {recurrentes.map((_,i) => <Cell key={i} fill={i===0 ? ACC : '#444'}/>)}
                      </Pie>
                      <Tooltip content={<TT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{flex:1, display:'flex', flexDirection:'column', gap:7}}>
                    {recurrentes.map((p,i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center', gap:6}}>
                          <div style={{width:7, height:7, borderRadius:2, background: i===0 ? ACC : '#444', flexShrink:0}}/>
                          <span style={{fontSize:11, color:'#aaa', fontFamily:'DM Mono'}}>{p.name}</span>
                        </div>
                        <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono'}}>{p.value} ({Math.round(p.value/filtered.length*100)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ── CLIENTES ── */}
        {tab === 'clientes' && (
          <div style={{display:'flex', flexDirection:'column', gap:22}}>
            <div style={{display:'flex', gap:6, flexWrap:'wrap', alignItems:'center'}}>
              <span style={{fontSize:9, color:MUTED, fontFamily:'DM Mono', letterSpacing:'0.1em'}}>AÑO:</span>
              <FB val="todos" cur={fy} set={setFy} label="Todos"/>
              {years.map(y => <FB key={y} val={y} cur={fy} set={setFy} label={y}/>)}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
              <Panel>
                <Sec>Sexo del cliente</Sec>
                {bySexo.length > 0 ? (
                  <div style={{display:'flex', gap:12, alignItems:'center', marginTop:8}}>
                    <ResponsiveContainer width={110} height={110}>
                      <PieChart>
                        <Pie data={bySexo} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={4} dataKey="value">
                          {bySexo.map((_,i) => <Cell key={i} fill={COLORS[i]}/>)}
                        </Pie>
                        <Tooltip content={<TT/>}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{flex:1, display:'flex', flexDirection:'column', gap:7}}>
                      {bySexo.map((p,i) => (
                        <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <div style={{display:'flex', alignItems:'center', gap:6}}>
                            <div style={{width:7, height:7, borderRadius:2, background:COLORS[i], flexShrink:0}}/>
                            <span style={{fontSize:11, color:'#aaa', fontFamily:'DM Mono'}}>{p.name}</span>
                          </div>
                          <span style={{fontSize:11, color:ACC, fontFamily:'DM Mono'}}>{p.value} ({Math.round(p.value/bySexo.reduce((s,x)=>s+x.value,0)*100)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <p style={{color:MUTED, fontSize:11, fontFamily:'DM Mono', margin:'8px 0'}}>Sin datos</p>}
              </Panel>
              <Panel>
                <Sec>Rango etario</Sec>
                {byEdad.length > 0 ? (
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={byEdad}>
                      <XAxis dataKey="name" tick={{fill:MUTED, fontSize:10, fontFamily:'DM Mono'}}/>
                      <YAxis tick={{fill:MUTED, fontSize:10}} width={20}/>
                      <Tooltip content={<TT/>}/>
                      <Bar dataKey="value" radius={[4,4,0,0]}>{byEdad.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p style={{color:MUTED, fontSize:11, fontFamily:'DM Mono', margin:'8px 0'}}>Sin datos de edad</p>}
              </Panel>
              <Panel>
                <Sec>Como nos conocieron</Sec>
                {byConocio.length > 0 ? BarH(byConocio) : <p style={{color:MUTED, fontSize:11, fontFamily:'DM Mono', margin:'8px 0'}}>Sin datos aún</p>}
              </Panel>
            </div>
            <Panel>
              <Sec>Top clientes por ingresos</Sec>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:11, fontFamily:'DM Mono'}}>
                  <thead>
                    <tr style={{background:'#1A1A1A'}}>
                      {['#','Cliente','Compras','Total','Ticket prom.'].map(h => (
                        <th key={h} style={{padding:'8px 14px', textAlign:'left', color:MUTED, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', borderBottom:`1px solid ${BORDER}`, whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topClientes.map((c,i) => (
                      <tr key={i} style={{background: i%2===0 ? '#151515' : MID}}>
                        <td style={{padding:'7px 14px', color: i<3 ? ACC : MUTED, fontWeight: i<3 ? 700 : 400}}>#{i+1}</td>
                        <td style={{padding:'7px 14px', color:TEXT}}>{c.name}</td>
                        <td style={{padding:'7px 14px', color:'#888'}}>{c.compras}</td>
                        <td style={{padding:'7px 14px', color:ACC, fontWeight:600}}>{fmtFull(c.total)}</td>
                        <td style={{padding:'7px 14px', color:'#888'}}>{fmtFull(c.total/c.compras)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ── NUEVA VENTA ── */}
        {tab === 'agregar' && (
          <div style={{maxWidth:660, margin:'0 auto', display:'flex', flexDirection:'column', gap:18}}>
            <div>
              <h2 style={{margin:'0 0 4px', fontFamily:"'Playfair Display',serif", fontSize:20}}>Nueva venta</h2>
              <p style={{margin:0, color:MUTED, fontSize:12, fontFamily:'DM Mono'}}>Pega el mensaje del grupo de WhatsApp con el formato estandar.</p>
            </div>
            <details style={{background:'#181818', border:`1px solid ${BORDER}`, borderRadius:8, padding:'10px 16px'}}>
              <summary style={{cursor:'pointer', fontSize:11, color:ACC, fontFamily:'DM Mono', letterSpacing:'0.08em'}}>VER FORMATO DE MENSAJE</summary>
              <pre style={{margin:'12px 0 0', fontSize:11, color:'#888', fontFamily:'DM Mono', lineHeight:1.9, whiteSpace:'pre-wrap'}}>{TEMPLATE}</pre>
            </details>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setParsed(null); setErr(''); setSaved(false); }}
              placeholder="Pega aca el mensaje completo..."
              style={{width:'100%', minHeight:260, background:CARD, border:`1px solid ${BORDER}`, borderRadius:10, color:TEXT, padding:16, fontFamily:'DM Mono', fontSize:12, resize:'vertical', outline:'none', lineHeight:1.7, boxSizing:'border-box'}}
            />
            <button onClick={handleParse} style={{background:ACC, color:DARK, border:'none', borderRadius:8, padding:'11px 22px', fontFamily:'DM Mono', fontSize:12, fontWeight:600, letterSpacing:'0.08em', cursor:'pointer'}}>
              PARSEAR VENTA
            </button>
            {err && <div style={{background:'#2A1010', border:'1px solid #5A2A2A', borderRadius:8, padding:12, color:'#FF9999', fontSize:12, fontFamily:'DM Mono'}}>Error: {err}</div>}
            {parsed && (
              <div style={{background:CARD, border:`1px solid ${ACC}44`, borderRadius:12, padding:20, display:'flex', flexDirection:'column', gap:12}}>
                <span style={{fontFamily:'DM Mono', fontSize:11, color:ACC, letterSpacing:'0.1em'}}>PREVISUALIZACION — VENTA N{parsed.n}</span>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 20px'}}>
                  {[
                    ['Cliente', parsed.c], ['Categoria', parsed.cat],
                    ['Producto', parsed.prod], ['Unidades', parsed.uni],
                    ['Monto', parsed.m ? fmtFull(parsed.m) : '—'], ['Tipo ceramica', parsed.tcer||'—'],
                    ['Provincia', parsed.prov||'—'], ['Ciudad', parsed.ciudad||'—'],
                    ['Canal', parsed.canal||'—'], ['Pago', parsed.mp||'—'],
                    ['Tipo venta', parsed.tipo||'—'], ['Sexo', parsed.sexo||'—'],
                    ['Rango etario', parsed.edad||'—'], ['Conocio', parsed.conocio||'—'],
                    ['Primera compra', parsed.primera ? 'Si' : 'No'], ['Recurrente', parsed.recurrente ? 'Si' : 'No'],
                  ].map(([k,v]) => (
                    <div key={k} style={{display:'flex', flexDirection:'column', gap:2}}>
                      <span style={{fontSize:9, color:'#444', fontFamily:'DM Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>{k}</span>
                      <span style={{fontSize:13, color:TEXT}}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} style={{marginTop:4, background: saved ? '#1A3A1A' : ACC, color: saved ? '#6ABA6A' : DARK, border:`1px solid ${saved ? '#3A7A3A' : ACC}`, borderRadius:8, padding:'11px 18px', fontFamily:'DM Mono', fontSize:12, fontWeight:600, cursor:'pointer', letterSpacing:'0.08em'}}>
                  {saved ? 'GUARDADO EN BASE DE DATOS' : 'CONFIRMAR Y GUARDAR'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── BASE DE DATOS ── */}
        {tab === 'base' && (
          <div style={{display:'flex', flexDirection:'column', gap:14}}>
            <div>
              <h2 style={{margin:'0 0 4px', fontFamily:"'Playfair Display',serif", fontSize:18}}>Base de datos</h2>
              <p style={{margin:0, color:MUTED, fontSize:11, fontFamily:'DM Mono'}}>{ventas.length} registros</p>
            </div>
            <div style={{overflowX:'auto', borderRadius:10, border:`1px solid ${BORDER}`}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:11, fontFamily:'DM Mono'}}>
                <thead>
                  <tr style={{background:'#1A1A1A'}}>
                    {['N','Fecha','Cliente','Sexo','Cat.','Tipo cer.','Productos','Uni.','Monto','Provincia','Canal','Pago','Tipo'].map(h => (
                      <th key={h} style={{padding:'9px 12px', textAlign:'left', color:MUTED, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', borderBottom:`1px solid ${BORDER}`, whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v,i) => (
                    <tr key={i} style={{background: v.anulada ? '#1A1010' : i%2===0 ? '#151515' : MID, opacity: v.anulada ? 0.5 : 1}}>
                      <td style={{padding:'7px 12px', color:ACC, fontWeight:600}}>{v.n}</td>
                      <td style={{padding:'7px 12px', color:'#777', whiteSpace:'nowrap'}}>{v.f}</td>
                      <td style={{padding:'7px 12px', color:TEXT, whiteSpace:'nowrap', maxWidth:130, overflow:'hidden', textOverflow:'ellipsis'}}>{v.c}</td>
                      <td style={{padding:'7px 12px', color:'#888'}}>{v.sexo||'—'}</td>
                      <td style={{padding:'7px 12px'}}>
                        <span style={{fontSize:9, padding:'2px 7px', borderRadius:4, background:`${CAT_COLORS[v.cat]||'#444'}22`, color:CAT_COLORS[v.cat]||'#aaa', border:`1px solid ${CAT_COLORS[v.cat]||'#444'}33`, whiteSpace:'nowrap'}}>{v.cat}</span>
                      </td>
                      <td style={{padding:'7px 12px', color:'#777'}}>{v.tcer||'—'}</td>
                      <td style={{padding:'7px 12px', color:'#666', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{v.prod}</td>
                      <td style={{padding:'7px 12px', color:'#888', textAlign:'center'}}>{v.uni}</td>
                      <td style={{padding:'7px 12px', color: v.m>0 ? ACC : MUTED, whiteSpace:'nowrap'}}>{v.m>0 ? fmtFull(v.m) : '—'}</td>
                      <td style={{padding:'7px 12px', color:'#888', whiteSpace:'nowrap'}}>{v.prov||'—'}</td>
                      <td style={{padding:'7px 12px', color:'#777', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{v.canal}</td>
                      <td style={{padding:'7px 12px', color:'#777', whiteSpace:'nowrap'}}>{v.mp}</td>
                      <td style={{padding:'7px 12px'}}>
                        <span style={{fontSize:9, padding:'2px 6px', borderRadius:3, background: v.tipo==='B2B' ? `${ACC}33` : v.tipo==='Canje' ? '#2A2A1A' : '#1A2A1A', color: v.tipo==='B2B' ? ACC : v.tipo==='Canje' ? '#AAA844' : '#5A9A5A'}}>{v.tipo}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
