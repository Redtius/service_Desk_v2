import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const LoginForm = ({ currentLanguage, onLanguageChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const labels = {
    en: {
      title: "Sign In to CrewAI Agent Manager",
      subtitle: "Access your service desk automation dashboard",
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      forgotPassword: "Forgot Password?",
      showPassword: "Show password",
      hidePassword: "Hide password",
      emailRequired: "Email address is required",
      passwordRequired: "Password is required",
      invalidCredentials: "Invalid email or password. Please try again.",
      emailPlaceholder: "Enter your email address",
      passwordPlaceholder: "Enter your password"
    },
    fr: {
      title: "Connexion au Gestionnaire d'Agents CrewAI",
      subtitle: "Accédez à votre tableau de bord d'automatisation du service desk",
      email: "Adresse E-mail",
      password: "Mot de Passe",
      signIn: "Se Connecter",
      forgotPassword: "Mot de passe oublié?",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      emailRequired: "L'adresse e-mail est requise",
      passwordRequired: "Le mot de passe est requis",
      invalidCredentials: "E-mail ou mot de passe invalide. Veuillez réessayer.",
      emailPlaceholder: "Entrez votre adresse e-mail",
      passwordPlaceholder: "Entrez votre mot de passe"
    }
  };

  const t = labels[currentLanguage];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = t.passwordRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/agent-dashboard');
    } catch (error) {
      setErrors({ general: error.detail || t.invalidCredentials });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface rounded-lg shadow-elevation-2 p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Bot" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-text-primary mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-text-secondary">
            {t.subtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <span className="text-sm text-error-700">{errors.general}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text-primary">
              {t.email}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t.emailPlaceholder}
              className={`w-full ${errors.email ? 'border-error focus:border-error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-error flex items-center space-x-1">
                <Icon name="AlertCircle" size={14} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              {t.password}
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t.passwordPlaceholder}
                className={`w-full pr-10 ${errors.password ? 'border-error focus:border-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-smooth"
                disabled={isLoading}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-error flex items-center space-x-1">
                <Icon name="AlertCircle" size={14} />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            className="h-12"
          >
            {t.signIn}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary-700 transition-smooth"
              disabled={isLoading}
            >
              {t.forgotPassword}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
