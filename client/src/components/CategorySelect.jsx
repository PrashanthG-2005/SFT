import React, { useState, useRef, useEffect } from 'react';

const CategorySelect = ({ value, onChange, options, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`category-select-wrapper ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <div 
        className="category-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex="0"
        onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(!isOpen); }}
      >
        <span>{selectedOption.label}</span>
      </div>
      
      <div className="category-select-dropdown">
        {options.map((opt) => (
          <div 
            key={opt.value}
            className={`category-select-option ${value === opt.value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
