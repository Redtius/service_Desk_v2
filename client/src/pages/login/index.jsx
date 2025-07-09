import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import LanguageToggle from './components/LanguageToggle';
import TrustSignals from './components/TrustSignals';
import CredentialsHelper from './components/CredentialsHelper';

const LoginPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  const labels = {
    en: {
      copyright: `© ${new Date().getFullYear()} SD Agent Manager. All rights reserved.`,
      poweredBy: "Powered by Neotech iT"
    },
    fr: {
      copyright: `© ${new Date().getFullYear()} Gestionnaire d'Agent SD. Tous droits réservés.`,
      poweredBy: "Propulsé par Neotech iT"
    }
  };

  const t = labels[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding and Info */}
            <div className="hidden lg:block space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-heading font-bold text-text-primary mb-4">
                  CrewAI Agent Manager
                </h1>
                <p className="text-lg text-text-secondary mb-8">
                  {currentLanguage === 'en' 
                    ? "Enterprise service desk automation platform for non-technical users to configure and manage AI agents without coding."
                    : "Plateforme d'automatisation de service desk d'entreprise permettant aux utilisateurs non techniques de configurer et gérer des agents IA sans programmation."
                  }
                </p>
                
                {/* Features List */}
                <div className="space-y-4">
                  {[
                    {
                      en: "Visual workflow designer with drag-and-drop interface",
                      fr: "Concepteur de flux de travail visuel avec interface glisser-déposer"
                    },
                    {
                      en: "Real-time agent monitoring and performance analytics",
                      fr: "Surveillance d'agents en temps réel et analyses de performance"
                    },
                    {
                      en: "Seamless integration with MS Teams and Jira Service",
                      fr: "Intégration transparente avec MS Teams et Jira Service"
                    },
                    {
                      en: "Multi-language support with enterprise security",
                      fr: "Support multilingue avec sécurité d'entreprise"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {feature[currentLanguage]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Trust Signals */}
              <TrustSignals currentLanguage={currentLanguage} />
            </div>

            {/* Right Side - Login Form */}
            <div className="space-y-6">
              <LoginForm 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
              
              {/* Demo Credentials Helper */}
              <CredentialsHelper currentLanguage={currentLanguage} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Language Toggle */}
            <LanguageToggle 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
            
            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-xs text-text-muted">{t.copyright}</p>
              <p className="text-xs text-text-muted mt-1">{t.poweredBy}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;