async function post_user_register_form(req, res) {
    try {
        const data = req.body; // Extract form data
        const files = req.files; // Extract the files uploaded through the form

        // Pass the form data and files to the model for processing
        await userRegisterModel.user_data_post(data, files, res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
    }
}


module.exports = {
    post_user_register_form,
};