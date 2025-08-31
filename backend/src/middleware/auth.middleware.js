const protectedRoute = (req, res, next) => {
    if (!req.auth().isAuthenticated) {
        return res.status(401).json({ message: "Unauthorized-you must login" });
    }
    next();
};

export { protectedRoute };
