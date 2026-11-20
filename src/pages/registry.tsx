import type { PageId } from '../content/business';
import { CookiePage } from './CookiePage';
import { HomePage } from './HomePage';
import { PrivacyPage } from './PrivacyPage';

export const pageComponents: Record<PageId, () => JSX.Element> = {
  home: HomePage,
  cookie: CookiePage,
  privacy: PrivacyPage,
};
