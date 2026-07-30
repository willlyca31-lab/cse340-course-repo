import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from "../models/organizations.js";

import {
    getProjectsByOrganizationId
} from "../models/projects.js";

/*
 * Display all organizations
 */
const showOrganizationsPage = async (req, res, next) => {

    try {

        const organizations =
            await getAllOrganizations();

        res.render("organizations", {

            title: "Our Partner Organizations",

            organizations

        });

    } catch (err) {

        next(err);

    }

};

/*
 * Display one organization
 */
const showOrganizationDetailsPage = async (req, res, next) => {

    try {

        const organizationId = req.params.id;

        const organization =
            await getOrganizationDetails(organizationId);

        if (!organization) {

            const err = new Error("Organization Not Found");

            err.status = 404;

            return next(err);

        }

        const projects =
            await getProjectsByOrganizationId(organizationId);

        res.render("organization", {

            title: organization.name,

            organization,

            projects

        });

    } catch (err) {

        next(err);

    }

};

/*
 * Display new organization form
 */
const showNewOrganizationForm = async (req, res) => {

    const title = "Add New Organization";

    res.render("new-organization", { title });

};

/*
 * Process new organization form
 */
const processNewOrganizationForm = async (req, res) => {

    const {
        name,
        description,
        contactEmail
    } = req.body;

    // Use the placeholder logo for all new organizations
    const logoFilename = "placeholder-logo.png";

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
      );

        // Set a success flash message
    req.flash('success', 'Organization added successfully!');
    
    res.redirect(`/organization/${organizationId}`);

};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};