import { initializeStore, getProducts } from '../services/store.js';
import { createProductCard } from '../components/productCard.js';
import { filterProducts } from '../utils/products.js';
import { $ } from '../utils/format.js';

initializeStore();

const products = filterProducts(getProducts(), { sort: 'recent' }).slice(0, 3);

// O mesmo componente é utilizado na página inicial e no catálogo.
$('featuredGrid').replaceChildren(...products.map(product => createProductCard(product, {
  showAdd: false,
  onDetails: () => { window.location.href = './catalogo.html'; },
})));
$('featuredEmpty').hidden = products.length > 0;
