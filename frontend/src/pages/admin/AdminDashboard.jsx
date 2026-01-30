import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">
                Admin <span className="gradient-text">Dashboard</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="stat-card-value">0</p>
                    <p className="stat-card-label">Total Users</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <p className="stat-card-value">0</p>
                    <p className="stat-card-label">Total Products</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="stat-card-value">0</p>
                    <p className="stat-card-label">Total Orders</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <p className="stat-card-value">$0</p>
                    <p className="stat-card-label">Total Revenue</p>
                </div>
            </div>

            <div className="glass-card">
                <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
                <p className="text-gray-400">Admin dashboard is under construction. More features coming soon...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
