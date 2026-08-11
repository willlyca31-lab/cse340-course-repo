
import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getUsers
} from '../models/users.js';

import {
    getProjectsByVolunteer
} from '../models/volunteers.js';

// =========================
// Registration
// =========================

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        req.flash(
            'success',
            'Registration successful! Please log in.'
        );

        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        res.redirect('/register');
    }
};

// =========================
// Login
// =========================

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            // Store authenticated user in session
            req.session.user = user;

            req.flash(
                'success',
                'Login successful!'
            );

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            // Redirect to protected dashboard
            res.redirect('/dashboard');
        } else {
            req.flash(
                'error',
                'Invalid email or password.'
            );

            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);

        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );

        res.redirect('/login');
    }
};

// =========================
// Require Login Middleware
// =========================

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

// =========================
// Require Role Middleware
// =========================

const requireRole = (role) => {
    return (req, res, next) => {
        // User must be logged in
        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access that page.'
            );

            return res.redirect('/login');
        }

        // User must have the required role
        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access that page.'
            );

            return res.redirect('/dashboard');
        }

        next();
    };
};

// =========================
// Logout
// =========================

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash(
        'success',
        'Logout successful!'
    );

    res.redirect('/login');
};

// =========================
// Dashboard
// =========================

const showDashboard = async (req, res, next) => {
    try {
        const user = req.session.user;

        const volunteerProjects =
            await getProjectsByVolunteer(user.user_id);

        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            role_name: user.role_name,
            volunteerProjects
        });

    } catch (error) {
        console.error(
            'Error loading dashboard:',
            error
        );

        next(error);
    }
};

// =========================
// Users Page
// =========================

const showUsers = async (req, res) => {
    try {
        const users = await getUsers();

        res.render('users', {
            title: 'Users',
            users
        });
    } catch (error) {
        console.error('Error getting users:', error);

        req.flash(
            'error',
            'Unable to retrieve users.'
        );

        res.redirect('/dashboard');
    }
};

// =========================
// Exports
// =========================

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
};