import express from "express";

// Home Controller
import { showHomePage } from "./controllers/index.js";

// Organization Controller
import {
  showOrganizationsPage,
  showOrganizationDetailsPage
} from "./controllers/organizations.js";

// Project Controller
import {
  showProjectsPage,
  showProjectDetailsPage
} from "./controllers/projects.js";

// Category Controller
import {
  showCategoriesPage,
  showCategoryDetailsPage
} from "./controllers/categories.js";

// Error Controller
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

/*
 * Home
 */
router.get("/", showHomePage);

/*
 * Organizations
 */
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

/*
 * Projects
 */
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

/*
 * Categories
 */
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetailsPage);

/*
 * Test Error Page
 */
router.get("/test-error", testErrorPage);

export default router;