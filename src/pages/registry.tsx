import type { PageId } from '../content/business';
import { HomePage } from './HomePage';
import { ProductsPage } from './ProductsPage';
import { ShopPage } from './ShopPage';

export const pageComponents: Record<PageId, () => JSX.Element> = {
  home: HomePage,
  prodotti: ProductsPage,
  negozio: ShopPage,
};
