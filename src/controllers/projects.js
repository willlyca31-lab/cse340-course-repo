import {
    getAllProjects,
    getProjectDetails,
    getCategoriesByProjectId
} from "../models/projects.js";

import {
    getAllOrganizations
} from "../models/organizations.js";
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

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

export {

    showProjectsPage,

    showProjectDetailsPage,

    showNewProjectForm,

    processNewProjectForm

};