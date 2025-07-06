// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Check if user has admin role
export const isAdmin = () => {
    try {
        // First try to get role from the user object in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.role) {
                const role = user.role.toLowerCase();
                return role === 'admin' || role === 'superadmin';
            }
        }
        
        // Fallback to roleName in localStorage
        const roleName = localStorage.getItem('roleName');
        if (roleName) {
            const role = roleName.toLowerCase();
            return role === 'admin' || role === 'superadmin';
        }
        
        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Get current user info
export const getCurrentUser = () => {
    try {
        // First try to get the user object from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return {
                id: user.id || localStorage.getItem('accountId'),
                name: user.name || user.accountName || '',
                email: user.email || '',
                role: user.role || localStorage.getItem('roleName') || 'user',
                ...user // Include any additional user data
            };
        }
        
        // Fallback to individual fields in localStorage
        return {
            id: localStorage.getItem('accountId'),
            name: localStorage.getItem('accountName') || '',
            email: localStorage.getItem('email') || '',
            role: localStorage.getItem('roleName') || 'user'
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Check if user has any of the required roles
export const hasAnyRole = (requiredRoles = []) => {
    try {
        if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true;
        
        const user = getCurrentUser();
        if (!user || !user.role) return false;
        
        const userRole = user.role.toString().toLowerCase();
        return requiredRoles.some(role => 
            role.toString().toLowerCase() === userRole
        );
    } catch (error) {
        console.error('Error checking user roles:', error);
        return false;
    }
};
