import {
    body,
    validationResult
} from "express-validator";


import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from "../models/categories.js";



import {
    getProjectDetails
} from "../models/projects.js";





/*
 * Category Validation
 */
const categoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage(
            "Category name is required"
        )
        .isLength({
            min: 3,
            max: 100
        })
        .withMessage(
            "Category name must be between 3 and 100 characters"
        )

];







/*
 * Display all categories
 */
const showCategoriesPage = async (
    req,
    res,
    next
) => {

    try {

        const categories =
            await getAllCategories();


        res.render(
            "categories",
            {
                title: "Service Categories",
                categories
            }
        );


    } catch (err) {

        next(err);

    }

};








/*
 * Display category details
 */
const showCategoryDetailsPage = async (
    req,
    res,
    next
) => {

    try {


        const categoryId =
            req.params.id;



        const category =
            await getCategoryDetails(
                categoryId
            );



        if (!category) {

            const err =
                new Error(
                    "Category Not Found"
                );

            err.status = 404;

            return next(err);

        }




        const projects =
            await getProjectsByCategoryId(
                categoryId
            );



        res.render(
            "category",
            {
                title: category.name,
                category,
                projects
            }
        );



    } catch (err) {

        next(err);

    }

};








/*
 * Display New Category Form
 */
const showNewCategoryForm = (
    req,
    res
) => {


    res.render(
        "new-category",
        {
            title:
                "Add New Category"
        }
    );


};








/*
 * Process Create Category
 */
const processNewCategoryForm = async (
    req,
    res,
    next
) => {

    try {


        const errors =
            validationResult(req);



        if (!errors.isEmpty()) {


            errors.array()
                .forEach(error => {

                    req.flash(
                        "error",
                        error.msg
                    );

                });



            return res.redirect(
                "/new-category"
            );

        }





        const {
            name
        } = req.body;





        const categoryId =
            await createCategory(
                name
            );





        req.flash(
            "success",
            "Category created successfully!"
        );




        res.redirect(
            `/category/${categoryId}`
        );



    } catch (err) {

        next(err);

    }

};










/*
 * Display Edit Category Form
 */
const showEditCategoryForm = async (
    req,
    res,
    next
) => {

    try {


        const categoryId =
            req.params.id;




        const category =
            await getCategoryDetails(
                categoryId
            );



        if (!category) {


            const err =
                new Error(
                    "Category Not Found"
                );


            err.status = 404;


            return next(err);

        }





        res.render(
            "edit-category",
            {
                title:
                    "Edit Category",

                category
            }
        );



    } catch(err) {

        next(err);

    }

};









/*
 * Process Edit Category
 */
const processEditCategoryForm = async (
    req,
    res,
    next
) => {

    try {


        const errors =
            validationResult(req);



        if (!errors.isEmpty()) {


            errors.array()
            .forEach(error => {

                req.flash(
                    "error",
                    error.msg
                );

            });



            return res.redirect(
                `/edit-category/${req.params.id}`
            );


        }





        const categoryId =
            req.params.id;



        const {
            name
        } = req.body;





        await updateCategory(
            categoryId,
            name
        );





        req.flash(
            "success",
            "Category updated successfully!"
        );




        res.redirect(
            `/category/${categoryId}`
        );



    } catch(err) {

        next(err);

    }

};










/*
 * Display Assign Categories Form
 */
const showAssignCategoriesForm = async (
    req,
    res,
    next
) => {

    try {


        const projectId =
            req.params.projectId;



        const projectDetails =
            await getProjectDetails(
                projectId
            );



        const categories =
            await getAllCategories();




        const assignedCategories =
            await getCategoriesByProjectId(
                projectId
            );




        res.render(
            "assign-categories",
            {

                title:
                    "Assign Categories to Project",

                projectId,

                projectDetails,

                categories,

                assignedCategories

            }
        );



    } catch(err) {

        next(err);

    }

};









/*
 * Process Assign Categories
 */
const processAssignCategoriesForm = async (
    req,
    res,
    next
) => {

    try {


        const projectId =
            req.params.projectId;




        let categoryIds =
            req.body.categoryIds || [];




        if (!Array.isArray(categoryIds)) {

            categoryIds =
                [categoryIds];

        }





        await updateCategoryAssignments(
            projectId,
            categoryIds
        );




        req.flash(
            "success",
            "Categories updated successfully!"
        );




        res.redirect(
            `/project/${projectId}`
        );



    } catch(err) {

        next(err);

    }

};









export {

    showCategoriesPage,

    showCategoryDetailsPage,

    showNewCategoryForm,

    processNewCategoryForm,

    showEditCategoryForm,

    processEditCategoryForm,

    showAssignCategoriesForm,

    processAssignCategoriesForm,

    categoryValidation

};