import { body, validationResult } from "express-validator";


import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from "../models/categories.js";


import {
    getProjectDetails
} from "../models/projects.js";





/*
 * Category validation rules
 */
const categoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "Category name must be between 3 and 100 characters"
        )

];







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
 * Display New Category Form
 */
const showNewCategoryForm = async (req, res) => {


    res.render(
        "new-category",
        {
            title: "Add New Category"
        }
    );


};









/*
 * Process New Category Form
 */
const processNewCategoryForm = async (req, res) => {


    const errors =
        validationResult(req);



    if (!errors.isEmpty()) {


        errors.array().forEach(error => {

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




    try {


        const categoryId =
            await createCategory(name);



        req.flash(
            "success",
            "Category created successfully!"
        );



        res.redirect(
            `/category/${categoryId}`
        );



    } catch (error) {


        console.error(
            error
        );


        req.flash(
            "error",
            "Unable to create category"
        );


        res.redirect(
            "/new-category"
        );

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
 * Process Edit Category Form
 */
const processEditCategoryForm = async (
    req,
    res
) => {


    const categoryId =
        req.params.id;



    const errors =
        validationResult(req);



    if (!errors.isEmpty()) {


        errors.array().forEach(error => {


            req.flash(
                "error",
                error.msg
            );


        });



        return res.redirect(
            `/edit-category/${categoryId}`
        );


    }






    const {
        name
    } = req.body;




    try {


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



    } catch(error) {


        console.error(error);



        req.flash(
            "error",
            "Unable to update category"
        );



        res.redirect(
            `/edit-category/${categoryId}`
        );


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
            await getProjectDetails(projectId);

        const categories =
            await getAllCategories();

        const assignedCategories =
            await getCategoriesByServiceProjectId(projectId);

        const title =
            "Assign Categories to Project";


        res.render(
            "assign-categories",
            {
                title,
                projectId,
                projectDetails,
                categories,
                assignedCategories
            }
        );


    } catch(error) {

        next(error);

    }

};




/*
 * Process Assign Categories
 */
const processAssignCategoriesForm = async (
    req,
    res
) => {


    const projectId =
        req.params.projectId;



    const selectedCategoryIds =
        req.body.categoryIds || [];



    const categoryIdsArray =
        Array.isArray(selectedCategoryIds)
        ?
        selectedCategoryIds
        :
        [selectedCategoryIds];



    await updateCategoryAssignments(
        projectId,
        categoryIdsArray
    );



    req.flash(
        "success",
        "Categories updated successfully."
    );



    res.redirect(
        `/project/${projectId}`
    );


};









/*
 * Display Category Details
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
            await getCategoryDetails(categoryId);




        if (!category) {


            const err =
                new Error(
                    "Category Not Found"
                );


            err.status = 404;


            return next(err);


        }





        const projects =
            await getProjectsByCategoryId(categoryId);





        res.render(
            "category",
            {

                title:
                    category.name,

                category,

                projects

            }
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