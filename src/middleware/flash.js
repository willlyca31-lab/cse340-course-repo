const defaultMessages = {

    success: [],
    error: [],
    warning: [],
    info: []

};



const flash = (req, res, next) => {


    if (!req.session.flash) {


        req.session.flash = {

            success: [],
            error: [],
            warning: [],
            info: []

        };

    }



    req.flash = function(type, message) {



        if (type && message) {


            if (!req.session.flash[type]) {

                req.session.flash[type] = [];

            }


            req.session.flash[type].push(message);


            return;

        }



        const messages = {

            ...defaultMessages,
            ...req.session.flash

        };



        req.session.flash = {

            success: [],
            error: [],
            warning: [],
            info: []

        };



        return messages;

    };



    res.locals.flash =
        req.flash.bind(req);



    next();

};



export default flash;