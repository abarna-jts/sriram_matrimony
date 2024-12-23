const db = require("../../../config/db_config")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
class UserAuth {
    async login(req, res) {
        try {
            const { username, password } = req.body; // Extract username and password from the request body
    
            // Query the database for the user's email
            const query = `SELECT * FROM users WHERE email = ?`;
            const [results] = await db.execute(query, [username]);
    
            if (results.length === 0) {
                // No user found with the provided email
                return res.status(401).send({ success: false, message: 'Invalid email or password' });
            }
    
            const user = results[0]; // Get the first (and only) user result
    
            // Compare the provided password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                // Password does not match
                return res.status(401).send({ success: false, message: 'Invalid email or password' });
            }
    
            // Generate a JWT token
            const token = jwt.sign(
                { id: user.id, user_name: user.name, email: user.email }, 
                'your_secret_key', // Replace this with your secret key
                { expiresIn: '1h' } // Optional: Token expiry time
            );
            req.session.token = token;
            console.log(token);
            req.session.user = user; // Save user data to the session
            // Send a response with the token
            res.status(200).send({ 
                success: true, 
                message: 'Login successful', 
                token 
            });
        } catch (error) {
            console.error('Error during login:', error.message);
            res.status(500).send({
                success: false,
                message: 'An unexpected error occurred. Please try again.'
            });
        }
    }

    async get(req, res) {
        console.log('enters');

        const user_id = req.session.user.id;
        console.log("session" + user_id);

        if (!user_id) {
            return res.status(401).send({ message: "Your Data is Empty Pleaase try again" });
        }
        const query = "SELECT * FROM USERS WHERE id = ?";

        const [result] = await db.query(query, user_id);
        // console.log(results);
        if (result.length > 0) {
            return res.status(200).json({ data: result})
        } else {
            return res.status(200).json({ message: "Your data is empty" })
        }
    }




}
module.exports = new UserAuth();