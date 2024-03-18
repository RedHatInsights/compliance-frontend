import React from 'react';
import DevAppEntry from './DevAppEntry';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DevAppEntry />);
