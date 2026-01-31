import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Scale, Info, AlertCircle } from 'lucide-react';

const TermsPage = () => {
    const sections = [
        {
            icon: Shield,
            title: 'Privacy & Data Protection',
            content: 'Your privacy is our top priority. We use industry-standard encryption to protect your personal information and payment data. We do not sell your data to third parties. By using our service, you agree to our data collection policies designed to improve your shopping experience.'
        },
        {
            icon: Scale,
            title: 'Terms of Service',
            content: 'Users must be at least 18 years old or have parental consent to use this platform. You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to refuse service or cancel orders at our sole discretion.'
        },
        {
            icon: Lock,
            title: 'Security Policy',
            content: 'We implement robust security measures to safeguard against unauthorized access. Users are prohibited from attempting to bypass any security features or using robots/crawlers on the site without express permission.'
        },
        {
            icon: AlertCircle,
            title: 'Limitation of Liability',
            content: 'Antigravity Shop is provided "as is" without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services or the inability to use them.'
        },
        {
            icon: FileText,
            title: 'Intellectual Property',
            content: 'All content on this site, including text, graphics, logos, and software, is the property of Antigravity Shop or its content suppliers and protected by international copyright laws.'
        }
    ];

    return (
        <div className="page-container">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold uppercase tracking-widest mb-6">
                            <Info className="w-4 h-4" />
                            Last Updated: January 31, 2026
                        </div>
                        <h1 className="text-5xl font-black mb-6 tracking-tight">
                            Legal <span className="gradient-text">Guidelines</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Please read our terms and conditions carefully. By accessing or using our services,
                            you agree to be bound by these terms.
                        </p>
                    </motion.div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card group hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                            <Icon className="w-6 h-6 text-purple-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3 text-white">
                                            {index + 1}. {section.title}
                                        </h2>
                                        <p className="text-gray-400 leading-relaxed font-medium">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Support Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Have questions about our terms?</h3>
                            <p className="text-white/80 font-medium">Our legal and support teams are here to clarify any concerns.</p>
                        </div>
                        <a href="/contact" className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2">
                            Contact Legal Team
                        </a>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 blur-3xl rounded-full -ml-32 -mb-32"></div>
                </motion.div>

                {/* Acceptance Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm italic">
                    By clicking "Accept" or continuing to use this site, you acknowledge that you have read and understood these Terms and Conditions.
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
