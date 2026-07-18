import express from "express";


// Home Controller
import {
    showHomePage
} from "./controllers/home.js";


// Organization Controller
import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from "./controllers/organization.js";


// Project Controller
import {
    showProjectsPage,
    showProjectDetailsPage
} from "./controllers/projects.js";


// Category Controller
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from "./controllers/category.js";


// Error Controller
import {
    testErrorPage
} from "./controllers/errors.js";



const router = express.Router();



/*
 * Home
 */
router.get(
    "/",
    showHomePage
);



/*
 * Organizations
 */
router.get(
    "/organizations",
    showOrganizationsPage
);


router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);



/*
 * Projects
 */
router.get(
    "/projects",
    showProjectsPage
);


router.get(
    "/project/:id",
    showProjectDetailsPage
);



/*
 * Categories
 */
router.get(
    "/categories",
    showCategoriesPage
);


router.get(
    "/category/:id",
    showCategoryDetailsPage
);



/*
 * Error Test
 */
router.get(
    "/test-error",
    testErrorPage
);



export default router;