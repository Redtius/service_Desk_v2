import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = ({ currentLanguage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const labels = {
    en: {
      demoCredentials: "Demo Credentials",
      testAccounts: "Test Accounts Available",
      showCredentials: "Show Test Credentials",
      hideCredentials: "Hide Test Credentials",
      administrator: "System Administrator",
      manager: "Service Desk Manager",
      analyst: "Business Analyst",
      email: "Email",
      password: "Password",
      role: "Role",
      note: "Note: These are demo credentials for testing purposes only."
    },
    fr: {
      demoCredentials: "Identifiants de Démonstration",
      testAccounts: "Comptes de Test Disponibles",
      showCredentials: "Afficher les Identifiants de Test",
      hideCredentials: "Masquer les Identifiants de Test",
      administrator: "Administrateur Système",
      manager: "Gestionnaire Service Desk",
      analyst: "Analyste Métier",
      email: "E-mail",
      password: "Mot de Passe",
      role: "Rôle",
      note: "Note: Ce sont des identifiants de démonstration à des fins de test uniquement."
    }
  };

  const t = labels[currentLanguage];

  const mockCredentials = [
    { 
      email: "admin@company.com", 
      password: "Admin123!", 
      role: t.administrator,
      color: "bg-primary-50 border-primary-200"
    },
    { 
      email: "manager@company.com", 
      password: "Manager123!", 
      role: t.manager,
      color: "bg-secondary-50 border-secondary-200"
    },
    { 
      email: "analyst@company.com", 
      password: "Analyst123!", 
      role: t.analyst,
      color: "bg-accent-50 border-accent-200"
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="TestTube" size={16} className="text-text-muted" />
          <h4 className="text-sm font-medium text-text-primary">{t.demoCredentials}</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {isExpanded ? t.hideCredentials : t.showCredentials}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <p className="text-xs text-text-secondary mb-4">
            {t.testAccounts}
          </p>
          
          {mockCredentials.map((cred, index) => (
            <div key={index} className={`p-3 rounded-lg border ${cred.color}`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="font-medium text-text-secondary">{t.email}:</span>
                  <div className="font-mono text-text-primary mt-1">{cred.email}</div>
                </div>
                <div>
                  <span className="font-medium text-text-secondary">{t.password}:</span>
                  <div className="font-mono text-text-primary mt-1">{cred.password}</div>
                </div>
                <div>
                  <span className="font-medium text-text-secondary">{t.role}:</span>
                  <div className="text-text-primary mt-1">{cred.role}</div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-warning-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning-700">{t.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;