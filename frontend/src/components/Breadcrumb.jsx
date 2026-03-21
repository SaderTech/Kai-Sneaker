import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
      <Link to="/home" className="hover:text-black transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" /> Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          {item.link ? (
            <Link to={item.link} className="hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;