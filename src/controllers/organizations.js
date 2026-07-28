import {
    body,
    validationResult
} from "express-validator";


import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from "../models/organizations.js";


import {
    getProjectsByOrganizationId
} from "../models/projects.js";



/*
 * Validation Rules
 */
const organizationValidation = [

    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Organization name is required"
        )
        .isLength({
            min: 3,
            max: 150
        })
        .withMessage(
            "Organization name must be between 3 and 150 characters"
        ),


    body("description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Organization description is required"
        )
        .isLength({
            max: 500
        })
        .withMessage(
            "Organization description cannot exceed 500 characters"
        ),


    body("contactEmail")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage(
            "Contact email is required"
        )
        .isEmail()
        .withMessage(
            "Please provide a valid email address"
        )

];



/*
 * Display all organizations
 */
const showOrganizationsPage = async (req, res, next) => {

    try {

        const organizations =
            await getAllOrganizations();


        res.render(
            "organizations",
            {
                title: "Our Partner Organizations",
                organizations
            }
        );


    } catch (err) {

        next(err);

    }

};



/*
 * Display organization details
 */
const showOrganizationDetailsPage = async (req, res, next) => {

    try {

        const organizationId =
            req.params.id;


        const organization =
            await getOrganizationDetails(
                organizationId
            );


        if (!organization) {

            const err =
                new Error(
                    "Organization Not Found"
                );

            err.status = 404;

            return next(err);

        }


        const projects =
            await getProjectsByOrganizationId(
                organizationId
            );


        res.render(
            "organization",
            {
                title: organization.name,
                organization,
                projects
            }
        );


    } catch (err) {

        next(err);

    }

};



/*
 * New organization form
 */
const showNewOrganizationForm = async (req, res, next) => {

    try {

        res.render(
            "new-organization",
            {
                title: "Add New Organization"
            }
        );


    } catch (err) {

        next(err);

    }

};



/*
 * Create organization
 */
const processNewOrganizationForm = async (req, res, next) => {

    try {

        const errors = validationResult(req);


        if (!errors.isEmpty()) {


            errors.array().forEach((error) => {

                req.flash(
                    "error",
                    error.msg
                );

            });


            return res.redirect(
                "/new-organization"
            );

        }



        const {
            name,
            description,
            contactEmail
        } = req.body;



        const logoFilename =
            "placeholder-logo.png";



        const organizationId =
            await createOrganization(
                name,
                description,
                contactEmail,
                logoFilename
            );



        req.flash(
            "success",
            "Organization added successfully!"
        );


        return res.redirect(
            `/organization/${organizationId}`
        );


    } catch (err) {

        next(err);

    }

};



export {

    showOrganizationsPage,

    showOrganizationDetailsPage,

    showNewOrganizationForm,

    processNewOrganizationForm,

    organizationValidation

};