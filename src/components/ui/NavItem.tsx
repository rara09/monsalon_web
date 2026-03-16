import React from 'react';
import { NavLink } from 'react-router-dom';

type NavMenuProps = {
  to: string;
  children: React.ReactNode;
};

const NavItem = ({ to, children }: NavMenuProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `border-b-3 hover:text-rose-500 py-6 ${isActive ? 'border-rose-500 text-rose-500' : 'border-transparent'}`
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;
