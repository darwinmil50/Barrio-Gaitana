import type { PageId } from '../../hooks/useHashRoute';
import { Home } from '../../pages/Home';
import { Mobility } from '../../pages/Mobility';
import { Security } from '../../pages/Security';
import { Services } from '../../pages/Services';
import { Territorial } from '../../pages/Territorial';

export function PageView({ page }: { page: PageId }) {
  switch (page) {
    case 'security': return <Security />;
    case 'mobility': return <Mobility />;
    case 'services': return <Services />;
    case 'territorial': return <Territorial />;
    case 'home':
    default: return <Home />;
  }
}
