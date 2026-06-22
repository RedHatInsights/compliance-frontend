import { createRoot } from 'react-dom/client';
import React from 'react';

import IopAppEntry from './IopAppEntry';

const mountNode = document.getElementById('root');

if (mountNode) {
  createRoot(mountNode).render(<IopAppEntry environment="production" />);
}
