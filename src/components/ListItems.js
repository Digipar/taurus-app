import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';
import ReorderIcon from '@mui/icons-material/Reorder';
import RoofingIcon from '@mui/icons-material/Roofing';

export const mainListItems = (
  <React.Fragment>
  <ListItemButton component={Link} to="/movimientos">
      <ListItemIcon>
        <ReorderIcon />
      </ListItemIcon>
      <ListItemText primary="Movimientos" />
    </ListItemButton>
    <ListItemButton component={Link} to="/articulos">
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary="Artículos" />
    </ListItemButton>
    <ListItemButton component={Link} to="/clientes">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItemButton>
    <ListItemButton component={Link} to="/tenant">
      <ListItemIcon>
        <RoofingIcon />
      </ListItemIcon>
      <ListItemText primary="Tenants" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>


  </React.Fragment>
);