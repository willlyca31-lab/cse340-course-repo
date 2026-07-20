import {
    getAllOrganizations,
    getOrganizationDetails
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
const showorganizationDetailsPage = async (req, res, next) => {

    try {

        const organizationId =
            req.params.id;

        const organization =
            await getorganizationDetails(organizationId);

        if (!organization) {

            const err = new Error("organization Not Found");

            err.status = 404;

            return next(err);

        }

        const projects =
            await getProjectsByorganizationId(organizationId);

        res.render("organization", {

            title: organization.name,

            organization,

            projects

        });

    } catch (err) {

        next(err);

    }

};

export {
    showorganizationsPage,
    showorganizationDetailsPage
};