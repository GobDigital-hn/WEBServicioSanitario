// Opciones para selects y validaciones del formulario

export const OPCIONES_PAIS = [
  { value: 'HN', label: 'Honduras' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'PA', label: 'Panamá' },
  { value: 'MX', label: 'México' },
  { value: 'US', label: 'Estados Unidos' },
];

export const OPCIONES_DEPARTAMENTO = [
  { value: 'AT', label: 'Atlántida' },
  { value: 'CH', label: 'Choluteca' },
  { value: 'CL', label: 'Colón' },
  { value: 'CM', label: 'Comayagua' },
  { value: 'CP', label: 'Copán' },
  { value: 'CR', label: 'Cortés' },
  { value: 'EP', label: 'El Paraíso' },
  { value: 'FM', label: 'Francisco Morazán' },
  { value: 'GD', label: 'Gracias a Dios' },
  { value: 'IN', label: 'Intibucá' },
  { value: 'IB', label: 'Islas de la Bahía' },
  { value: 'LP', label: 'La Paz' },
  { value: 'LE', label: 'Lempira' },
  { value: 'OC', label: 'Ocotepeque' },
  { value: 'OL', label: 'Olancho' },
  { value: 'SB', label: 'Santa Bárbara' },
  { value: 'VA', label: 'Valle' },
  { value: 'YO', label: 'Yoro' },
];

export const OPCIONES_FORMA_COSMETICA = [
  { value: 'crema', label: 'Crema' },
  { value: 'lotion', label: 'Loción' },
  { value: 'gel', label: 'Gel' },
  { value: 'shampoo', label: 'Shampoo' },
  { value: 'jabon', label: 'Jabón' },
  { value: 'perfume', label: 'Perfume' },
  { value: 'maquillaje', label: 'Maquillaje' },
  { value: 'otro', label: 'Otro' },
];

export const OPCIONES_TIPO_DOCUMENTO = [
  { value: 'rtn', label: 'RTN' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'cedula', label: 'Cédula de Identidad' },
];

export const VALIDACIONES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Por favor ingrese un email válido',
  },
  telefono: {
    pattern: /^[0-9]{8,10}$/,
    message: 'Por favor ingrese un teléfono válido (8-10 dígitos)',
  },
  rtn: {
    pattern: /^[0-9]{14}$/,
    message: 'El RTN debe tener 14 dígitos',
  },
};

