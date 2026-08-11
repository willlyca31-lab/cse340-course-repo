import { body, validationResult } from "express-validator";

import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    createProject,
    updateProject
} from "../models/projects.js";

import {
    getAllOrganizations
} from "../models/organizations.js";

import {
    addVolunteer,
    removeVolunteer,
    isVolunteer
} from "../models/volunteers.js";


/*
 * Project validation rules
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
            max: 255
        })
        .withMessage(
            "Location must be less than 255 characters"
        ),

    body("project_date")
        .notEmpty()
        .withMessage("Project date is required")
        .isISO8601()
        .withMessage(
            "Project date must be a valid date"
        ),

    body("organization_id")
        .notEmpty()
        .withMessage("Organization is required")
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

    } catch (error) {

        next(error);

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

        if (!project) {

            const error =
                new Error(
                    "Project Not Found"
                );

            error.status = 404;

            return next(error);

        }

        const categories =
            await getCategoriesByProjectId(
                projectId
            );

        /*
         * Check if the logged-in user
         * is already volunteering.
         */
        let volunteering = false;

        if (req.session.user) {

            volunteering =
                await isVolunteer(
                    req.session.user.user_id,
                    projectId
                );

        }

        res.render(
            "project",
            {

                title: project.name,

                project,

                categories,

                volunteering,

                sessionUser:
                    req.session.user || null

            }
        );

    } catch (error) {

        next(error);

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

    } catch (error) {

        next(error);

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
            "/new-project"
        );

    }

    const {
        title,
        description,
        location,
        project_date,
        organization_id
    } = req.body;

    try {

        const projectId =
            await createProject(

                title,

                description,

                location,

                project_date,

                organization_id

            );

        req.flash(
            "success",
            "Project created successfully!"
        );

        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

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

        if (!project) {

            const error =
                new Error(
                    "Project Not Found"
                );

            error.status = 404;

            return next(error);

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

    } catch (error) {

        next(error);

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
            `/edit-project/${req.params.id}`
        );

    }

    try {

        await updateProject(

            req.params.id,

            req.body.title,

            req.body.description,

            req.body.location,

            req.body.project_date,

            req.body.organization_id

        );

        req.flash(
            "success",
            "Project updated successfully!"
        );

        res.redirect(
            `/project/${req.params.id}`
        );

    } catch (error) {

        next(error);

    }

};


/*
 * Add current user as a volunteer
 */
const volunteerForProject = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.session.user.user_id;

        const projectId =
            req.params.id;

        await addVolunteer(
            userId,
            projectId
        );

        req.flash(
            "success",
            "You are now volunteering for this project."
        );

        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

    }

};


/*
 * Remove current user as a volunteer
 */
const removeVolunteerFromProject = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.session.user.user_id;

        const projectId =
            req.params.id;

        await removeVolunteer(
            userId,
            projectId
        );

        req.flash(
            "success",
            "You are no longer volunteering for this project."
        );

        res.redirect(
            `/project/${projectId}`
        );

    } catch (error) {

        next(error);

    }

};


export {

    showProjectsPage,

    showProjectDetailsPage,

    showNewProjectForm,

    processNewProjectForm,

    showEditProjectForm,

    processEditProjectForm,

    volunteerForProject,

    removeVolunteerFromProject,

    projectValidation

};