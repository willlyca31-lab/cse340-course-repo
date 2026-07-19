import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId
} from "../models/projects.js";
/*
 * Display all projects
 */
const showProjectsPage = async (req, res, next) => {

    try {

        const projects =
            await getAllProjects();

        res.render("projects", {

            title: "Service Projects",

            projects

        });

    } catch (err) {

        next(err);

    }

};

/*
 * Display one project
 */
const showProjectDetailsPage = async (req, res, next) => {

    try {

        const projectId =
            req.params.id;

        const project =
            await getProjectDetails(projectId);

        if (!project) {

            const err = new Error("Project Not Found");

            err.status = 404;

            return next(err);

        }

        const categories =
            await getCategoriesByProjectId(projectId);

        res.render("project", {

            title: project.name,

            project,

            categories

        });

    } catch (err) {

        next(err);

    }

};

export {

    showProjectsPage,

    showProjectDetailsPage

};