import { body, validationResult } from "express-validator";


import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";


import {
    getProjectsByOrganizationId
} from "../models/projects.js";





/*
 * Organization Validation Rules
 */
const organizationValidation = [

    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Organization name is required")
        .isLength({
            min:3,
            max:150
        })
        .withMessage(
            "Organization name must be between 3 and 150 characters"
        ),



    body("description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Organization description is required")
        .isLength({
            max:500
        })
        .withMessage(
            "Organization description cannot exceed 500 characters"
        ),



    body("contactEmail")
        .normalizeEmail()
        .notEmpty()
        .withMessage("Contact email is required")
        .isEmail()
        .withMessage(
            "Please provide a valid email address"
        )

];







/*
 * Display all organizations
 */
const showOrganizationsPage = async (
    req,
    res,
    next
)=>{


    try{


        const organizations =
            await getAllOrganizations();



        res.render(
            "organizations",
            {

                title:"Our Partner Organizations",

                organizations

            }
        );



    }catch(error){

        next(error);

    }


};









/*
 * Display organization details
 */
const showOrganizationDetailsPage = async (
    req,
    res,
    next
)=>{


    try{


        const organizationId =
            req.params.id;



        const organizationDetails =
            await getOrganizationDetails(
                organizationId
            );



        if(!organizationDetails){


            const error =
                new Error(
                    "Organization Not Found"
                );


            error.status=404;


            return next(error);

        }





        const projects =
            await getProjectsByOrganizationId(
                organizationId
            );





        res.render(
            "organization",
            {

                title:
                    organizationDetails.name,

                organizationDetails,

                projects

            }
        );




    }catch(error){

        next(error);

    }


};









/*
 * Display new organization form
 */
const showNewOrganizationForm = async (
    req,
    res
)=>{


    res.render(
        "new-organization",
        {

            title:
            "Add New Organization"

        }
    );


};









/*
 * Process new organization
 */
const processNewOrganizationForm = async (
    req,
    res
)=>{


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
            "/new-organization"
        );


    }





    try{


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
            "Organization created successfully!"
        );




        res.redirect(
            `/organization/${organizationId}`
        );




    }catch(error){


        console.error(error);



        req.flash(
            "error",
            "Unable to create organization"
        );



        res.redirect(
            "/new-organization"
        );


    }


};









/*
 * Display edit organization form
 */
const showEditOrganizationForm = async (
    req,
    res,
    next
)=>{


    try{


        const organizationId =
            req.params.id;



        const organizationDetails =
            await getOrganizationDetails(
                organizationId
            );



        if(!organizationDetails){


            const error =
                new Error(
                    "Organization Not Found"
                );


            error.status=404;


            return next(error);

        }




        res.render(
            "edit-organization",
            {


                title:
                "Edit Organization",


                organizationDetails


            }
        );




    }catch(error){

        next(error);

    }


};









/*
 * Process edit organization
 */
const processEditOrganizationForm = async (
    req,
    res,
    next
)=>{


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
            `/edit-organization/${req.params.id}`
        );


    }





    try{


        const organizationId =
            req.params.id;




        const {

            name,

            description,

            contactEmail,

            logoFilename


        } = req.body;






        await updateOrganization(

            organizationId,

            name,

            description,

            contactEmail,

            logoFilename || "placeholder-logo.png"

        );





        req.flash(
            "success",
            "Organization updated successfully!"
        );





        res.redirect(
            `/organization/${organizationId}`
        );





    }catch(error){


        console.error(error);



        next(error);


    }


};







export {


    showOrganizationsPage,

    showOrganizationDetailsPage,

    showNewOrganizationForm,

    processNewOrganizationForm,

    showEditOrganizationForm,

    processEditOrganizationForm,

    organizationValidation


};