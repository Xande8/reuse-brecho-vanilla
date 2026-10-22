import { element, button } from './dom.js';
import { money } from '../utils/format.js';
import { getCategoryName } from '../data/categories.js';

// Um card é montado com elementos reais do DOM, sem usar innerHTML.
export function createProductCard(product, options) {
  const { onAdd, onFavorite, onDetails, isFavorite = false, showAdd = true } = options;

  const card = element('article', { className: 'product-card' });
  const visual = element('div', { className: 'product-visual' });
  const picture = button('', () => onDetails(product.id), 'picture-button', {
    'aria-label': `Ver detalhes de ${product.name}`,
  });

  const image = element('img', {
    attrs: {
      src: product.image || './assets/logo.png',
      alt: product.name,
      loading: 'lazy',
    },
  });
  image.addEventListener('error', () => {
    image.src = './assets/logo.png';
  }, { once: true });

  picture.appendChild(image);
  visual.appendChild(picture);

  if (onFavorite) {
    visual.appendChild(button(isFavorite ? '♥' : '♡', () => onFavorite(product.id),
      `heart ${isFavorite ? 'selected' : ''}`, {
        'aria-label': isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
      }));
  }
  card.appendChild(visual);

  const details = element('div', { className: 'product-details' });
  details.appendChild(element('span', {
    className: 'eyebrow',
    text: getCategoryName(product.category_id),
  }));
  details.appendChild(element('h3', { text: product.name }));
  details.appendChild(element('p', {
    className: 'subtle',
    text: [product.color, `Tam. ${product.size}`].filter(Boolean).join(' · '),
  }));

  const bottom = element('div', { className: 'product-bottom' });
  bottom.appendChild(element('strong', {
    className: 'product-price',
    text: money(product.price),
  }));
  if (showAdd) {
    bottom.appendChild(button('+', () => onAdd(product.id), 'round-add', {
      'aria-label': `Adicionar ${product.name} à sacola`,
    }));
  } else {
    bottom.appendChild(button('Ver peça →', () => onDetails(product.id), 'see-product'));
  }
  details.appendChild(bottom);
  card.appendChild(details);
  return card;
}
