// Os dados do projeto são arrays de objetos JavaScript (sem back-end nesta etapa).
export const categories = [
  { id: 'vestidos', name: 'Vestidos' },
  { id: 'conjuntos', name: 'Conjuntos e macacões' },
  { id: 'saias', name: 'Saias e shorts' },
  { id: 'blusas', name: 'Blusas e croppeds' },
  { id: 'calcas', name: 'Calças' },
  { id: 'masculino', name: 'Peças masculinas' },
];

export const getCategoryName = (id) => categories.find(c => c.id === id)?.name ?? 'Sem categoria';
