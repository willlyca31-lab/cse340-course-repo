import express from "express";

import { showHomePage } from "./controllers/index.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from "./controllers/organizations.js";

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from "./controllers/projects.js";

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
} from "./controllers/categories.js";

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
} from "./controllers/users.js";

import {
    testErrorPage
} from "./controllers/errors.js";

const router = express.Router();

/*
 * HOME
 */

router.get(
    "/",
    showHomePage
);

// =========================
// USER REGISTRATION
// =========================

router.get(
    "/register",
    showUserRegistrationForm
);

router.post(
    "/register",
    processUserRegistrationForm
);

// =========================
// USER LOGIN
// =========================

router.get(
    "/login",
    showLoginForm
);

router.post(
    "/login",
    processLoginForm
);

router.get(
    "/logout",
    processLogout
);

// =========================
// DASHBOARD
// =========================

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);

// =========================
// USERS - ADMIN ONLY
// =========================

router.get(
    "/users",
    requireRole("admin"),
    showUsers
);

/*
 * ORGANIZATIONS
 */

// View organizations - public
router.get(
    "/organizations",
    showOrganizationsPage
);

// View organization details - public
router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

// Create organization - ADMIN ONLY
router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization - ADMIN ONLY
router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);

/*
 * PROJECTS
 */

// View projects - public
router.get(
    "/projects",
    showProjectsPage
);

// View project details - public
router.get(
    "/project/:id",
    showProjectDetailsPage
);

// Create project - ADMIN ONLY
router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

// Edit project - ADMIN ONLY
router.get(
    "/edit-project/:id",
    requireRole("admin"),
    showEditProjectForm
);

router.post(
    "/edit-project/:id",
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

/*
 * ASSIGN CATEGORIES TO PROJECT
 */

// ADMIN ONLY
router.get(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    showAssignCategoriesForm
);

router.post(
    "/project/:projectId/assign-categories",
    requireRole("admin"),
    processAssignCategoriesForm
);

/*
 * CATEGORIES
 */

// View categories - public
router.get(
    "/categories",
    showCategoriesPage
);

// View category details - public
router.get(
    "/category/:id",
    showCategoryDetailsPage
);

// Create category - ADMIN ONLY
router.get(
    "/new-category",
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

// Edit category - ADMIN ONLY
router.get(
    "/edit-category/:id",
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

/*
 * TEST ERROR PAGE
 */

router.get(
    "/test-error",
    testErrorPage
);

export default router;