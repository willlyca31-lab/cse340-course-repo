import {
    getAllOrganizations,
    getOrganizationDetails
} from "../models/organizations.js";

import {
    getProjectsByOrganizationId
} from "../models/projects.js";

/*
 * Organizations page
 */
const showOrganizationsPage = async (req, res, next) => {

    try {

        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Partner Organizations",
            organizations
        });

    } catch (err) {

        next(err);

    }

};

/*
 * Organization Details
 */
const showOrganizationDetailsPage = async (req, res, next) => {

    try {

        const organizationId = req.params.id;

        const organizationDetails =
            await getOrganizationDetails(organizationId);

        if (!organizationDetails) {

            const err = new Error("Organization Not Found");
            err.status = 404;
            return next(err);

        }

        const projects =
            await getProjectsByOrganizationId(organizationId);

        res.render("organization", {

            title: organizationDetails.name,
            organizationDetails,
            projects

        });

    } catch (err) {

        next(err);

    }

};

export {

    showOrganizationsPage,
    showOrganizationDetailsPage

};