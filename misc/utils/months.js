const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const getMonth = (date) => {
  const dateFormat = new Date(date);
  const Month = dateFormat.toLocaleString('es-es', { month: 'long' });
  return Month;
};

module.exports = {
  months,
  getMonth,
};
