import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from "../models/categories.js";

/*
 * Display all categories
 */
const showCategoriesPage = async (req, res, next) => {

    try {

        const categories =
            await getAllCategories();

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

        const categoryId =
            req.params.id;

        const category =
            await getCategoryDetails(categoryId);

        if (!category) {

            const err = new Error("Category Not Found");

            err.status = 404;

            return next(err);

        }

        const projects =
            await getProjectsByCategoryId(categoryId);

        res.render("category", {

            title: category.name,

            category,

            projects

        });

    } catch (err) {

        next(err);

    }

};

export {

    showCategoriesPage,

    showCategoryDetailsPage

};