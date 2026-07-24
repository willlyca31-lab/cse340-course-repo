import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from "../models/categories.js";

import {
    getProjectDetails
} from "../models/projects.js";

/*
 * Display all categories
 */
const showCategoriesPage = async (req, res, next) => {

    try {

        const categories = await getAllCategories();

        res.render("categories", {
            title: "Service Categories",
            categories
        });

    } catch (err) {

        next(err);

    }

};

/*
 * Display one category
 */
const showCategoryDetailsPage = async (req, res, next) => {

    try {

        const categoryId = req.params.id;

        const category = await getCategoryDetails(categoryId);

        if (!category) {

            const err = new Error("Category Not Found");
            err.status = 404;

            return next(err);

        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render("category", {
            title: category.name,
            category,
            projects
        });

    } catch (err) {

        next(err);

    }

};

/*
 * Display the Assign Categories form
 */
const showAssignCategoriesForm = async (req, res, next) => {

    try {

        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        const categories = await getAllCategories();

        const assignedCategories =
            await getCategoriesByServiceProjectId(projectId);

        const title = "Assign Categories to Project";

        res.render("assign-categories", {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });

    } catch (err) {

        next(err);

    }

};

/*
 * Process Assign Categories form
 */
const processAssignCategoriesForm = async (req, res, next) => {

    try {

        const projectId = req.params.projectId;

        const selectedCategoryIds =
            req.body.categoryIds || [];

        const categoryIdsArray =
            Array.isArray(selectedCategoryIds)
                ? selectedCategoryIds
                : [selectedCategoryIds];

        await updateCategoryAssignments(
            projectId,
            categoryIdsArray
        );

        req.flash(
            "success",
            "Categories updated successfully."
        );

        res.redirect(`/project/${projectId}`);

    } catch (err) {

        next(err);

    }

};

export {

    showCategoriesPage,

    showCategoryDetailsPage,

    showAssignCategoriesForm,

    processAssignCategoriesForm

};