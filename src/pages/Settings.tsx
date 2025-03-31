import React, { useState } from 'react';
import { User, Bell, Shield, Wallet, Moon, Sun, ChevronRight, CreditCard, Globe, Lock, Mail, Phone, UserPlus, Users, Zap } from 'lucide-react';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  const sections = [
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        { 
          label: 'Profile Information',
          description: 'Update your personal details',
          icon: <User className="w-4 h-4" />,
          badge: 'Verified'
        },
        { 
          label: 'Security Settings',
          description: 'Manage your account security',
          icon: <Lock className="w-4 h-4" />,
          badge: '2FA Active'
        },
        { 
          label: 'Connected Accounts',
          description: 'Manage social media connections',
          icon: <Globe className="w-4 h-4" />,
          badge: '3 Connected'
        },
        { 
          label: 'Phone Number',
          description: 'Add or change phone number',
          icon: <Phone className="w-4 h-4" />,
          badge: 'Verified'
        }
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        { 
          label: 'Push Notifications',
          description: 'Configure mobile alerts',
          icon: <Zap className="w-4 h-4" />,
          toggle: true
        },
        { 
          label: 'Email Notifications',
          description: 'Manage email preferences',
          icon: <Mail className="w-4 h-4" />,
          toggle: true
        },
        { 
          label: 'Price Alerts',
          description: 'Set token price notifications',
          icon: <Bell className="w-4 h-4" />,
          toggle: true
        }
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      items: [
        { 
          label: 'Two-Factor Authentication',
          description: 'Enable extra security layer',
          icon: <Lock className="w-4 h-4" />,
          toggle: true
        },
        { 
          label: 'Active Sessions',
          description: 'Manage device access',
          icon: <Globe className="w-4 h-4" />,
          badge: '2 Devices'
        },
        { 
          label: 'Login History',
          description: 'View recent account activity',
          icon: <Shield className="w-4 h-4" />
        }
      ],
    },
    {
      title: 'Payment & Wallet',
      icon: <Wallet className="w-5 h-5" />,
      items: [
        { 
          label: 'Connected Wallets',
          description: 'Manage blockchain wallets',
          icon: <Wallet className="w-4 h-4" />,
          badge: '2 Active'
        },
        { 
          label: 'Payment Methods',
          description: 'Add or remove payment options',
          icon: <CreditCard className="w-4 h-4" />,
          badge: '3 Cards'
        },
        { 
          label: 'Transaction Limits',
          description: 'Adjust trading limits',
          icon: <Users className="w-4 h-4" />,
          badge: 'Level 2'
        },
        { 
          label: 'Referral Program',
          description: 'Invite friends and earn rewards',
          icon: <UserPlus className="w-4 h-4" />,
          badge: '12 Invited'
        }
      ],
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and security</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-tik-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-tik-cyan" />
              ) : (
                <Sun className="w-5 h-5 text-tik-pink" />
              )}
              <div>
                <span className="font-semibold">Dark Mode</span>
                <p className="text-sm text-gray-400">Adjust the appearance</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                darkMode ? 'bg-tik-cyan' : 'bg-gray-400'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-tik-card rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-tik-gray flex items-center justify-center text-tik-cyan">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-tik-gray/50 hover:bg-tik-gray transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tik-gray/50 flex items-center justify-center text-tik-cyan">
                      {item.icon}
                    </div>
                    
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className="px-2 py-1 rounded-full bg-tik-gray text-xs text-gray-400">
                        {item.badge}
                      </span>
                    )}
                    {item.toggle !== undefined ? (
                      <div className={`w-10 h-5 rounded-full relative ${
                        item.toggle ? 'bg-tik-cyan' : 'bg-gray-400'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          item.toggle ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};