const db = require("../../config/db_config");


class UserCotroller {

    async get_user_data(req, res) {
        try {
            // Extract filters using correct query parameter names
            const gender = req.query.DropDownList8 || ""; // Gender
            const language = req.query.Cntrl_DD_Religion || ""; // Language
            const caste = req.query.Cntrl_DD_Caste || ""; // Caste
            const subCaste = req.query.Cntrl_DD_SubCaste || ""; // Sub-Caste
            const maritalStatus = req.query.Cntrl_DD_MaritalStatus || ""; // Marital Status
            const ageFrom = parseInt(req.query.Cntrl_DD_AgeFrom) || 0; // Age From
            const ageTo = parseInt(req.query.Cntrl_DD_To) || 100; // Age To

            const page = Math.max(1, parseInt(req.query.page) || 1); // Pagination: current page
            const limit = 10; // Items per page
            const offset = (page - 1) * limit;

            // Build the WHERE clause dynamically
            const whereClause = `
                WHERE 
                    (u.gender LIKE ?)
                    AND (u.language LIKE ? OR u.language IS NULL)
                    AND (p.caste LIKE ? OR p.caste IS NULL)
                    AND (p.sub_caste LIKE ? OR p.sub_caste IS NULL)
                    AND (u.marital_status LIKE ? OR u.marital_status IS NULL)
                    AND (u.dob IS NOT NULL AND TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN ? AND ?)
            `;
            const params = [
                `%${gender}%`,
                `%${language}%`,
                `%${caste}%`,
                `%${subCaste}%`,
                `%${maritalStatus}%`,
                ageFrom,
                ageTo,
            ];

            // Main query: Get filtered and paginated results
            const query = `
                SELECT 
                u.id, 
                u.name, 
                u.gender, 
                u.language, 
                u.marital_status, 
                up.file_name,
                TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) AS age, 
                p.caste, 
                p.sub_caste
            FROM 
                users u
            LEFT JOIN 
                preferences p ON u.id = p.user_id
            LEFT JOIN 
                uploads up ON u.id = up.user_id
            ${whereClause}
            LIMIT ? OFFSET ?
            `;
            params.push(limit, offset); // Pagination parameters

            const [rows] = await db.query(query, params);

            // Count query: Total records for pagination (no LIMIT/OFFSET)
            const countQuery = `
                SELECT 
                    COUNT(*) AS total
                FROM 
                    users u
                LEFT JOIN 
                    preferences p ON u.id = p.user_id
                ${whereClause}
            `;
            const [countResult] = await db.query(countQuery, params.slice(0, -2)); // Exclude LIMIT/OFFSET params

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit); // Calculate total pages

            // Render search page with results
            // console.log(rows);

            res.render("user/search", {
                payload: rows,
                currentPage: page,
                totalPages: totalPages,
                filters: req.query, // Pass filters for form prepopulation
            });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).render("user/search", {
                payload: [],
                currentPage: 1,
                totalPages: 0,
                filters: req.query,
                error: "An error occurred while fetching data.",
            });
        }
    }
    async show_user_data(req, res) {
        try {
            let id = req.query.param1;
            if(req.query.status == "edit"){
                id = req.query.user;
                // console.log(id);
                
            }

            const query = `
            SELECT 
                    u.*, 
                    p.*, 
                    up.*, 
                    ti.*, 
                    hd.*, 
                    fd.*, 
                    ad.*, 
                    DATE_FORMAT(u.dob, '%d/%m/%Y') AS birth_day_of_week
            FROM 
                users u
            LEFT JOIN 
                preferences p ON u.id = p.user_id
            LEFT JOIN 
                uploads up ON u.id = up.user_id
            LEFT JOIN
                time_details ti ON u.id = ti.user_id
            LEFT JOIN
                horoscope_details hd ON u.id = hd.user_id
            LEFT JOIN
                family_details fd ON u.id = fd.user_id
            LEFT JOIN 
                additional_details ad ON u.id = ad.user_id
            WHERE u.id = ?`;

            const [userDatas] = await db.query(query, [id]);
            console.log(userDatas);
            
            const stars = {
                1: "-- Select Star --",
                2: "ANUSHAM",
                3: "ASTHAM",
                4: "ASWINI",
                5: "AVITTAM",
                6: "AYILYAM",
                7: "BARANI",
                8: "CHITRAI",
                9: "HASTHAM",
                10: "KETTAI",
                11: "KRITHIGAI",
                12: "MAGAM",
                13: "MIRUGASIRISHAM",
                14: "MOOLAM",
                15: "POORADAM",
                16: "POORAM",
                17: "POOSAM",
                18: "PUNARPOOSAM",
                19: "POORATTATHI",
                20: "REVATHI",
                21: "ROHINI",
                22: "SADAYAM",
                23: "SWATHI",
                24: "THIRUVADIRAI",
                25: "THIRUVONAM",
                26: "UTHIRADAM",
                27: "UTHIRAM",
                28: "UTTHIRATTATHI",
                29: "VISAGAM",
            };
            const raasiSigns = {
                0: "-- Select Rasi --",
                1: "MESHAM",
                2: "RISHABAM",
                3: "MITHUNAM",
                4: "KATAKAM",
                5: "SIMMAM",
                6: "KANNI",
                7: "VRICHIKA",
                8: "THULAM",
                9: "MAGARAM",
                10: "KUMBHAM",
                11: "MEENAM",
                12: "DHANUSU"
            };
            const heights = {
                1: "-Select-",
                2: "4ft - 121 cm",
                3: "4ft 1in - 124cm",
                4: "4ft 2in - 127cm",
                5: "4ft 3in - 129cm",
                6: "4ft 4in - 132cm",
                7: "4ft 5in - 134cm",
                8: "4ft 6in - 137cm",
                9: "4ft 7in - 139cm",
                10: "4ft 8in - 142cm",
                11: "4ft 9in - 144cm",
                12: "4ft 10in - 147cm",
                13: "4ft 11in - 149cm",
                14: "5ft - 152cm",
                15: "5ft 1in - 154cm",
                16: "5ft 2in - 157cm",
                17: "5ft 3in - 160cm",
                18: "5ft 4in - 162cm",
                19: "5ft 5in - 165cm",
                20: "5ft 6in - 167cm",
                21: "5ft 7in - 170cm",
                22: "5ft 8in - 172cm",
                23: "5ft 9in - 175cm",
                24: "5ft 10in - 177cm",
                25: "5ft 11in - 180cm",
                26: "6ft - 182cm",
                27: "6ft 1in - 185cm",
                28: "6ft 2in - 187cm",
                29: "6ft 3in - 190cm",
                30: "6ft 4in - 193cm",
                31: "6ft 5in - 195cm",
                32: "6ft 6in - 198cm",
                33: "6ft 7in - 200cm",
                34: "6ft 8in - 203cm",
                35: "6ft 9in - 205cm",
                36: "6ft 10in - 208cm",
                37: "6ft 11in - 210cm",
                38: "7ft - 213cm"
            };
            

            // console.log(userDatas);
            if(req.query.status == "edit"){
                res.render("user/edit_user", { data: userDatas, stars, raasiSigns, heights });
            }
            res.render("user/show_user_data", { data: userDatas, stars, raasiSigns, heights });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).send("An error occurred while fetching user data.");
        }
    }

}
module.exports = new UserCotroller()