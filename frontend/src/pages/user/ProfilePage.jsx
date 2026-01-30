import { useAuth } from '../../context/AuthContext';
import { User, Store, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, isSeller, becomeSeller } = useAuth();

    const handleBecomeSeller = async () => {
        const result = await becomeSeller();
        if (result.success) {
            window.location.href = '/seller';
        }
    };

    return (
        <div className="page-container">
            <div className="section-container max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    My <span className="gradient-text">Profile</span>
                </h1>

                <div className="grid gap-6">
                    <div className="glass-card">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user?.name}</h2>
                                <p className="text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Store className="w-5 h-5 text-gray-400" />
                                <span>{isSeller ? 'Seller Account' : 'Customer Account'}</span>
                            </div>
                        </div>
                    </div>

                    {!isSeller && (
                        <div className="glass-card text-center hero-gradient">
                            <h3 className="text-2xl font-bold mb-4">Become a Seller</h3>
                            <p className="text-gray-300 mb-6">
                                Start selling your products and reach thousands of customers
                            </p>
                            <button onClick={handleBecomeSeller} className="btn-primary">
                                Become a Seller
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
