import React from 'react';

import { PlacesProvider } from './Places';

const AppProvider: React.FC = ({ children }) => (
  <PlacesProvider>{children}</PlacesProvider>
);

export default AppProvider;
