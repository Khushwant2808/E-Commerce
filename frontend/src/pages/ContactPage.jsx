import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';

const ContactPage = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to submit an issue");
            return;
        }

        setLoading(true);
        try {
            await contactAPI.submit(formData);
            toast.success("Issue submitted successfully! Our team will look into it.");
            setFormData({ subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit message");
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'Call Us',
            details: '+1 (555) 000-0000',
            description: 'Mon-Fri from 8am to 5pm',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: 'support@antigravity.shop',
            description: 'Online support 24/7',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: '123 Tech Avenue',
            description: 'Silicon Valley, CA 94025',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-black mb-6 tracking-tight">
                            Report an <span className="gradient-text">Issue</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                            Need help with your order or found a bug? Tell us about it below.
                            If you're logged in, we'll automatically link this to your account.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Contact Cards */}
                    <div className="space-y-6">
                        {contactInfo.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                            <p className="text-white font-semibold mb-1">{item.details}</p>
                                            <p className="text-gray-400 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Social/Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/20"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-indigo-400">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Support Hours</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white font-medium">24 Hours</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Weekend</span>
                                    <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                {user ? (
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xl font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Logged in as</p>
                                            <p className="font-bold text-white">{user.name} ({user.email})</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8">
                                        You must be logged in to report an issue. This ensures we can get back to you personally.
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Subject / Area</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            disabled={!user}
                                            className="input-field pl-12 disabled:opacity-50"
                                            placeholder="e.g. Payment Issue, Delivery Delay, Website Bug"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Describe the Issue</label>
                                    <textarea
                                        required
                                        disabled={!user}
                                        rows="6"
                                        className="input-field resize-none py-4 disabled:opacity-50"
                                        placeholder="Please provide as much detail as possible..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={user ? { scale: 1.02 } : {}}
                                    whileTap={user ? { scale: 0.98 } : {}}
                                    disabled={loading || !user}
                                    type="submit"
                                    className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Submit Support Request</span>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
