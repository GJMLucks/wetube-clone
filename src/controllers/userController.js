import bcrypt from 'bcrypt';
import User from '../models/User';

export const getJoin = (req, res) => res.render("createAccount", { pageTitle: "Create Account" });
export const postJoin = async(req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";

    if ( password !== password2 ){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation failed.",
        });
    }

    const exists = await User.exists({ $or: [{ username }, { email }] });

    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username or email already exists",
        });
    }
    try {
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        });
        return res.redirect("/login");
    } catch (e) {
        return res.status(400).render("join", {
            pageTitle: "Upload Video",
            errorMessage: e._message,
        });
    }
};

export const getEdit = async (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const {
        session : {
            user : { _id, avatarUrl },
        },
        body : { name, email, username, password },
        file : { path },
    } = req;

    const updatedUser = await User.findByIdAndUpdate(
        _id, 
        {
            avatarUrl : file ? file.path : avatarUrl,
            name, 
            email, 
            username, 
            password,
        },
        { new : true }
    );
    
    if (req.session.user.username !== updatedUser.username) {
        const username = updatedUser.username;
        const exists = await User.exists(username);

        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle,
                errorMessage: "This username already exists",
            });
        }
    }
    if (req.session.user.email !== updatedUser.email) {
        const email = updatedUser.email;
        const exists = await User.exists(email);

        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle,
                errorMessage: "This email already exists",
            });
        }
    }

    req.session.user = updatedUser

    return res.render("edit-profile");
};

export const edit = (req, res) => res.send("edit : " + req.params);
export const remove = (req, res) => res.send("remove : " + req.params);

export const getLogin = (req, res) => res.render("login", { pageTitle : "Login"});
export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });

    if (!user) {
        return res.status(404).render("login", { 
            pageTitle,
            errorMessage : "An account with this username does not exist.",
        });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return res.status(404).render("login", { 
            pageTitle,
            errorMessage : "Wrong password.",
        });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
export const see = async(req, res) => {
    // it's public url, so get userID from url  
    const { id } = req.params;
    const user = await User.findOne(id);
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found", errorMessage});
    }
    return res.render("users/profile", { pageTitle : user.name, user})
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const OAuthUrl = `${baseUrl}?${params}`;
    return res.redirect(OAuthUrl);
};
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const Url = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(Url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            }
        })
    ).json();

    const apiUrl = "https://api.github.com";
    if("access_token" in tokenRequest) {
        const { access_Token } = tokenRequest;

        // userData
        
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_Token}`,
                },
            })
        ).json();
        console.log(userData);
        
        // emailData

        const emailData = await (
            await fetch(`${apiUrl}/user/email`, {
                headers: {
                    Authorization: `token ${access_Token}`,
                },
            })
        ).json();
        console.log(emailData);
        const emailObj = emailData.find(
            email => email.primary === true && email.verified === true
        );

        // error handling
        if(!emailObj) {
            return res.redirect("login");
        }

        // check if the email is in database
        let user = await User.findOne({ email: emailObj.email });

        if(!user){
            // email is not in database, create a new account
            user = await User.create({
                name: userData.name, 
                username: userData.login, 
                email: emailObj.email,  
                password: "", 
                socialOnly: true, 
                location: userData.location, 
            });
        }
        // login success
        req.session.loggedIn = true;
        req.session.user = existingUser;
        return res.redirect("/");

    }else {
        return res.redirect("login");
    }
};