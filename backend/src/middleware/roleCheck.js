// Role-based access control middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Extract roles from JWT token
    // Asgardeo includes roles in the token under 'groups' or 'roles' claim
    const userRoles = (req.auth && req.auth.permissions) || (req.auth && req.auth.groups) || [];
    
    // Check if user has at least one of the allowed roles
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        error: 'Access Denied',
        message: `This endpoint requires one of the following roles: ${allowedRoles.join(', ')}`,
        yourRoles: userRoles
      });
    }
    
    // Attach user roles to request for further use
    req.userRoles = userRoles;
    next();
  };
};

// Check for specific role
const requireAdmin = requireRole(['admin', 'Administrator']);
const requireUser = requireRole(['user', 'User', 'admin', 'Administrator']);
const requireViewer = requireRole(['viewer', 'Viewer', 'user', 'User', 'admin', 'Administrator']);

module.exports = {
  requireRole,
  requireAdmin,
  requireUser,
  requireViewer
};
