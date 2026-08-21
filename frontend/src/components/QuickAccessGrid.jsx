import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, 
  MessageSquare, 
  Heart, 
  CheckSquare, 
  Bookmark, 
  Star,
  Info,
  Lightbulb
} from 'lucide-react';

const QuickAccessGrid = ({ items = [] }) => {
  const navigate = useNavigate();
  
  const getIcon = (id) => {
    const icons = {
      'centro': Info,
      'mapa': Map,
      'tecnicas': Lightbulb,
      'comunidad': MessageSquare,
      'checklist': CheckSquare,
      'mislugares': Bookmark,
      'resenas': Star,
      'emotions': Heart,
    };
    return icons[id] || Info;
  };
  
  const getSectionColor = (id) => {
    const colors = {
      'centro': 'var(--section-home)',
      'mapa': 'var(--section-map)',
      'tecnicas': 'var(--section-activities)',
      'comunidad': 'var(--section-community)',
      'checklist': 'var(--section-emotions)',
      'mislugares': 'var(--section-home)',
      'resenas': 'var(--section-activities)',
      'emotions': 'var(--section-emotions)',
    };
    return colors[id] || 'var(--section-home)';
  };
  
  return (
    <div className="mb-5">
      <h2 className="text-[18px] font-bold text-[#0f172a] mb-3">Accesos rápidos</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => {
          const Icon = getIcon(it.id);
          const sectionColor = getSectionColor(it.id);
          return (
            <button 
              key={it.id} 
              className="relative bg-white border border-gray-200 rounded-2xl p-5 lg:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer text-left group overflow-hidden"
              onClick={() => navigate(it.to)}
              style={{
                transition: 'all 0.3s ease',
              }}
            >
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 group-hover:opacity-15 transition-opacity"
                style={{ backgroundColor: sectionColor }}
              />
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${sectionColor}15` }}
              >
                <Icon 
                  size={20} 
                  className="lg:w-6 lg:h-6"
                  style={{ color: sectionColor }} 
                />
              </div>
              <div 
                className="text-xs font-bold uppercase tracking-wider mb-1 lg:mb-2"
                style={{ color: sectionColor }}
              >
                {it.kicker}
              </div>
              <div className="text-[#1b2a4a] font-semibold text-sm lg:text-base leading-tight">{it.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
