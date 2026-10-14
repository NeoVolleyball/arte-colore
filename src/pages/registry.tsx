import { ProductsPage } from './ProductsPage';
import { ShopPage } from './ShopPage';

export type LegacyPageId = 'prodotti' | 'negozio';

/** Legacy pages (old "Cartella colori" design). The home page is the new
 *  single-page site in src/site/ and has its own client entry. */
export const pageComponents: Record<LegacyPageId, () => JSX.Element> = {
  prodotti: ProductsPage,
  negozio: ShopPage,
};
