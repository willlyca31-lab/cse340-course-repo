import {
    body,
    validationResult
} from "express-validator";


import {
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    getCategoriesByProjectId
} from "../models/projects.js";


import {
    getAllOrganizations
} from "../models/organizations.js";





/*
 * Project Validation Rules
 */
const projectValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({
            min: 3,
            max: 200
        })
        .withMessage(
            "Title must be between 3 and 200 characters"
        ),


    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({
            max: 1000
        })
        .withMessage(
            "Description must be less than 1000 characters"
        ),


    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({
            max: 200
        })
        .withMessage(
            "Location must be less than 200 characters"
        ),


    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage(
            "Date must be a valid date"
        ),


    body("organizationId")
        .notEmpty()
        .withMessage(
            "Organization is required"
        )
        .isInt()
        .withMessage(
            "Organization must be a valid integer"
        )

];









/*
 * Display all projects
 */
const showProjectsPage = async (
    req,
    res,
    next
) => {

    try {


        const projects =
            await getAllProjects();



        res.render(
            "projects",
            {
                title: "Service Projects",
                projects
            }
        );


    } catch(err){

        next(err);

    }

};









/*
 * Display project details
 */
const showProjectDetailsPage = async (
    req,
    res,
    next
) => {


    try {


        const projectId =
            req.params.id;



        const project =
            await getProjectDetails(
                projectId
            );



        if(!project){

            const err =
                new Error(
                    "Project Not Found"
                );

            err.status = 404;

            return next(err);

        }



        const categories =
            await getCategoriesByProjectId(
                projectId
            );



        res.render(
            "project",
            {
                title: project.name,
                project,
                categories
            }
        );


    } catch(err){

        next(err);

    }

};









/*
 * Display new project form
 */
const showNewProjectForm = async (
    req,
    res,
    next
) => {


    try {


        const organizations =
            await getAllOrganizations();



        res.render(
            "new-project",
            {
                title:
                    "Add New Service Project",

                organizations

            }
        );


    }catch(err){

        next(err);

    }

};









/*
 * Process new project form
 */
const processNewProjectForm = async (
    req,
    res,
    next
) => {


    try {


        const errors =
            validationResult(req);



        if(!errors.isEmpty()){


            errors.array()
            .forEach(error=>{

                req.flash(
                    "error",
                    error.msg
                );

            });


            return res.redirect(
                "/new-project"
            );

        }




        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;





        const projectId =
            await createProject(
                title,
                description,
                location,
                date,
                organizationId
            );





        req.flash(
            "success",
            "New service project created successfully!"
        );



        res.redirect(
            `/project/${projectId}`
        );


    }catch(err){

        next(err);

    }

};









/*
 * Display edit project form
 */
const showEditProjectForm = async (
    req,
    res,
    next
) => {


    try {


        const projectId =
            req.params.id;



        const project =
            await getProjectDetails(
                projectId
            );



        if(!project){

            const err =
                new Error(
                    "Project Not Found"
                );

            err.status = 404;

            return next(err);

        }




        const organizations =
            await getAllOrganizations();





        res.render(
            "edit-project",
            {

                title:
                    "Edit Service Project",

                project,

                organizations

            }
        );


    }catch(err){

        next(err);

    }

};









/*
 * Process edit project form
 */
const processEditProjectForm = async (
    req,
    res,
    next
) => {


    try {


        const projectId =
            req.params.id;



        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;





        await updateProject(

            projectId,

            title,

            description,

            location,

            date,

            organizationId

        );





        req.flash(
            "success",
            "Project updated successfully!"
        );





        res.redirect(
            `/project/${projectId}`
        );



    }catch(err){


        next(err);

    }

};









export {

    showProjectsPage,

    showProjectDetailsPage,

    showNewProjectForm,

    processNewProjectForm,

    showEditProjectForm,

    processEditProjectForm,

    projectValidation

};