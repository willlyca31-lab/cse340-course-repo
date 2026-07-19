const showHomePage = async (req, res) => {

    res.render("home", {
        title: "Home"
    });

};

export {
    showHomePage
};