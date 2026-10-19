import type { PageId } from '../content/business';
import { HomePage } from './HomePage';

export const pageComponents: Record<PageId, () => JSX.Element> = {
  home: HomePage,
};
