import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Users, Award, Rocket, Heart, Zap, Globe } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden hero-gradient">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="section-container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                            Our <span className="gradient-text">Story</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Crafting premium experiences for the modern shopper. We believe that luxury should be accessible, and quality should never be compromised.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section-container py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-10"
                    >
                        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="w-8 h-8 text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            To empower every individual with the finest selection of products, backed by a seamless shopping experience and unparalleled customer support. We strive to bridge the gap between craftsmanship and the digital marketplace.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card p-10"
                    >
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                            <Rocket className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            To become the world's most trusted destination for luxury and premium products, setting new standards in e-commerce excellence and sustainable business practices that inspire the global community.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-white/5 py-24">
                <div className="section-container text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Core <span className="gradient-text">Values</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">The principles that guide us every day in building a better shopping ecosystem.</p>
                </div>

                <div className="section-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ValueCard
                        icon={Shield}
                        title="Trust & Safety"
                        description="Your security is our top priority. Every transaction is encrypted and every seller is verified."
                        color="purple"
                    />
                    <ValueCard
                        icon={Heart}
                        title="Customer First"
                        description="We build for you. Your feedback drives our innovation and shapes our platform's future."
                        color="pink"
                    />
                    <ValueCard
                        icon={Zap}
                        title="Innovation"
                        description="Constantly evolving with cutting-edge technology to provide a faster, smoother experience."
                        color="blue"
                    />
                    <ValueCard
                        icon={Globe}
                        title="Sustainability"
                        description="Committed to reducing our environmental footprint and supporting ethical craftsmanship."
                        color="green"
                    />
                </div>
            </section>

            {/* Team Section */}
            <section className="section-container py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Meet the <span className="gradient-text">Team</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">The minds behind LuxeCommerce working tirelessly to redefine your wardrobe.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TeamMember
                        name="Alex Rivera"
                        role="Founder & CEO"
                        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    />
                    <TeamMember
                        name="Sarah Chen"
                        role="Head of Content"
                        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                    />
                    <TeamMember
                        name="James Wilson"
                        role="CTO"
                        image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                    />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white/5 py-24">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Frequently Asked <span className="gradient-text">Questions</span></h2>
                        <p className="text-gray-400">Everything you need to know about shopping with us.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <FAQItem
                            question="How do I track my order?"
                            answer="Once your order ships, you'll receive an email with a tracking number and a link to track your package on our website."
                        />
                        <FAQItem
                            question="What is your return policy?"
                            answer="We offer a 30-day hassle-free return policy for all unworn and unwashed items with tags still attached."
                        />
                        <FAQItem
                            question="Do you ship internationally?"
                            answer="Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location."
                        />
                        <FAQItem
                            question="How can I become a seller?"
                            answer="You can apply to become a seller through your account dashboard. Once verified, you can start listing products."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-container py-24">
                <div className="glass-card p-12 text-center hero-gradient relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users className="w-64 h-64" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                        Experience the new standard of online shopping. Be the first to know about new arrivals and exclusive collections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary px-10"
                            >
                                Start Shopping
                            </motion.button>
                        </Link>
                        <Link to="/profile">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary px-10"
                            >
                                Become a Seller
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ValueCard = ({ icon: Icon, title, description, color }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-card text-center"
    >
        <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl bg-${color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-7 h-7 text-${color}-400`} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const FAQItem = ({ question, answer }) => (
    <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-2">{question}</h3>
        <p className="text-gray-400">{answer}</p>
    </div>
);

const TeamMember = ({ name, role, image }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="group relative"
    >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-lg font-bold">{name}</p>
                <p className="text-sm text-gray-300">{role}</p>
            </div>
        </div>
        <div className="text-center group-hover:hidden transition-all duration-300">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-400">{role}</p>
        </div>
    </motion.div>
);

export default AboutPage;
