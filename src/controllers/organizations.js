import { body, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from "../models/organizations.js";

import {
    getProjectsByOrganizationId
} from "../models/projects.js";


// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

/*
 * Display all organizations
 */
const showOrganizationsPage = async (req, res) => {

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
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
};