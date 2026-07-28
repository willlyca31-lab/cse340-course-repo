import express from "express";


import {
    showHomePage
} from "./controllers/index.js";



import {

    showOrganizationsPage,

    showOrganizationDetailsPage,

    showNewOrganizationForm,

    processNewOrganizationForm,

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

    testErrorPage

} from "./controllers/errors.js";



const router =
    express.Router();





/*
 * HOME
 */
router.get(
    "/",
    showHomePage
);







/*
 * ORGANIZATIONS
 */

router.get(
    "/organizations",
    showOrganizationsPage
);


router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);


router.get(
    "/new-organization",
    showNewOrganizationForm
);


router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
);







/*
 * PROJECTS
 */

router.get(
    "/projects",
    showProjectsPage
);


router.get(
    "/new-project",
    showNewProjectForm
);


router.post(
    "/new-project",
    projectValidation,
    processNewProjectForm
);



router.get(
    "/project/:id",
    showProjectDetailsPage
);





/*
 * EDIT PROJECT
 */

router.get(
    "/edit-project/:id",
    showEditProjectForm
);



router.post(
    "/edit-project/:id",
    projectValidation,
    processEditProjectForm
);







/*
 * ASSIGN PROJECT CATEGORIES
 */

router.get(
    "/assign-categories/:projectId",
    showAssignCategoriesForm
);



router.post(
    "/assign-categories/:projectId",
    processAssignCategoriesForm
);







/*
 * CATEGORIES
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
 * CREATE CATEGORY
 */

router.get(
    "/new-category",
    showNewCategoryForm
);



router.post(
    "/new-category",
    categoryValidation,
    processNewCategoryForm
);







/*
 * EDIT CATEGORY
 */

router.get(
    "/edit-category/:id",
    showEditCategoryForm
);



router.post(
    "/edit-category/:id",
    categoryValidation,
    processEditCategoryForm
);








/*
 * TEST ERROR
 */

router.get(
    "/test-error",
    testErrorPage
);





export default router;