import multer from 'multer';

export const pageNotFoundHandler = (req, res, next) => {
    res.status(404).render("404", { pageTitle: "Page not found."})
}

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetubes";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const protectMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect("/login");
    }
    return next();
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return res.redirect("/");
    }
    return next();
}

export const avatarUpload = multer({ 
    destination: "uploads/avatars/",
    limits: {
        fileSize : 3000000,
    },
});

export const videoUpload = multer({ 
    destination: "uploads/videos/",
    limits: {
        fileSize : 10000000,
    }, 
});