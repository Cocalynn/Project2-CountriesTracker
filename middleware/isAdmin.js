module.exports = (req, res, next) => {
    // check is the user is an admin
    if(req.session.currentUser.role != "admin")
    {
        // to be confirmed
        return res.redirect("/");
    }
    else
    {
      next()
    }
}