const userRegisterModel = require("../model/userRegisterModel")


class Register_controller {



    async post_user_register_form(req, res) {
        try {
            const files = req.files;
            const formData = req.body;
    
            // Pass both files and formData to the model    
            await userRegisterModel.user_data_post(formData, files);
    
            return res.status(200).send("Success");
        } catch (error) {
            console.error("Error in user registration:", error);
            return res.status(500).send("Failed to register user");
        }
    }
    

    async search_users(req, res) {

        if (req.body) {
            try {
                let data = await userRegisterModel.search(req.body);
                if (data.length === 0) {
                    return res.status(404).json({ message: 'No users found' });
                }
                return res.status(200).json({ data: data });
            } catch (err) {
                console.error('Error in search_users:', err);
                return res.status(500).json({ message: 'Error executing search', error: err.message });
            }
        } else {
            return res.status(400).json({ message: 'No data provided' });
        }
    }


}

module.exports = new Register_controller();
