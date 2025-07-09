import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const labels = {
    en: {
      selectLanguage: "Select Language"
    },
    fr: {
      selectLanguage: "Sélectionner la Langue"
    }
  };

  const t = labels[currentLanguage];

  return (
    <div className="flex items-center justify-center space-x-2">
      <Icon name="Globe" size={16} className="text-text-muted" />
      <span className="text-sm text-text-secondary">{t.selectLanguage}:</span>
      <div className="flex space-x-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "primary" : "ghost"}
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className="px-3 py-1"
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageToggle;