import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ currentLanguage }) => {
  const labels = {
    en: {
      securityCompliance: "Security & Compliance",
      iso27001: "ISO 27001 Certified",
      soc2: "SOC 2 Type II Compliant",
      gdpr: "GDPR Compliant",
      encryption: "256-bit SSL Encryption",
      uptime: "99.9% Uptime SLA",
      support: "24/7 Enterprise Support"
    },
    fr: {
      securityCompliance: "Sécurité et Conformité",
      iso27001: "Certifié ISO 27001",
      soc2: "Conforme SOC 2 Type II",
      gdpr: "Conforme RGPD",
      encryption: "Chiffrement SSL 256-bit",
      uptime: "SLA de disponibilité 99,9%",
      support: "Support Entreprise 24/7"
    }
  };

  const t = labels[currentLanguage];

  const trustItems = [
    { icon: "Shield", text: t.iso27001 },
    { icon: "CheckCircle", text: t.soc2 },
    { icon: "Lock", text: t.gdpr },
    { icon: "Key", text: t.encryption },
    { icon: "Clock", text: t.uptime },
    { icon: "Headphones", text: t.support }
  ];

  return (
    <div className="bg-surface-secondary rounded-lg p-6 border border-border">
      <h3 className="text-sm font-medium text-text-primary mb-4 text-center">
        {t.securityCompliance}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={item.icon} size={12} className="text-success-600" />
            </div>
            <span className="text-xs text-text-secondary">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;