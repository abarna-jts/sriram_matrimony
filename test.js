const db = require('../../config/db_config');
const mysql = require('mysql2');  // Import the mysql2 package
const bcrypt = require('bcryptjs');

class userRegisterModel {
    async user_data_post(data, files, res) {
        try {
            // Start the transaction
            await db.beginTransaction();
            const hasedpassword = await bcrypt.hash(data.txtpsword, 10)

            // Insert into users table


 const [userResult] = await db.query(
    `INSERT INTO users (
        name, gender, marital_status, dob,blood_group, mobile_no,email, password, present_address, permanent_address,
       contact_person, height, weight, language, profile_picture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        data.txtName,
        data.Radiomale,
        data.Radiomaritial3,
        data.calendar1_container,
        data.ddlbloodgroup,
        data.txtMobileNo,
        data.txtuser,
        hasedpassword,
        data.txtpresentaddress,
        data.txtpermanentaddress,
        data.txtcontactperson,
        data.ddlheight,
        data.ddlweight,
        data.ddlmothertongue,
        files && files.profile_picture ? files.profile_picture[0].path : null  // handle optional file upload
    ]
);
const userId = userResult.insertId;
            // Insert into `uploads` table if files are provided
            if (files?.FileUpload3?.length > 0 || files?.FileUpload2?.length > 0) {
                await db.query(`
                    INSERT INTO uploads (
                        user_id, file_name, file_name_two, file_path, file_description
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        userId,
                        files.FileUpload3?.[0]?.path || null, // Safely access FileUpload3 path
                        files.FileUpload2?.[0]?.path || null, // Safely access FileUpload2 path
                        files?.filePath || null,
                        data.fileDescription || null
                    ]
                );
            }
            

            // Insert into family_details table
            await db.query(
                `INSERT INTO family_details (
                    user_id, father_name, father_job, father_alive, mother_name, mother_job, mother_alive, elder_brothers, younger_brothers, elder_sisters, younger_sisters, 
                    spouse_name, spouse_job, siblings_status, father_status, mother_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.txtfathername,
                    data.txtfatherjob,
                    data.FatherAlive,
                    data.txtmothername,
                    data.txtmotherjob,
                    data.MotherAlive,
                    data.ddlmelderbrother,
                    data.ddlmyoungerbrother,
                    data.ddlmeldersister,
                    data.ddlmyoungersister,
                    data.txtspousename,
                    data.txtspousejob,
                    data.siblings_status,
                    data.father_status,
                    data.mother_status
                ]
            );

            // Insert into preferences table
            await db.query(
                `INSERT INTO preferences (
                    user_id, diet, qualification, ex_job, job,  complexion, preferred_age_from, preferred_age_to, 
                    preferred_height, education_status, religion, caste, income_range, ex_married, ex_unmarried, ex_widow, Divorce, ex_doesntmatter
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.Diet,
                    data.txtpqualification,
                    data.txtplaceofjob1,
                    data.job,
                    data.complexion,
                    data.ddlPreferredAgeFrom,
                    data.ddlPreferredAgeTo,
                    data.ddlheight,
                    data.education_status,
                    data.religion,
                    data.ddlcaste,
                    data.income_range,
                    data.chkUnmarried,
                    data.chkmarried,
                    data.chkWidow,
                    data.chkDivorced,
                    data.chkdoesntmatter,
                ]
            );

            // Insert into horoscope_details table
            const query = `
    INSERT INTO horoscope_details (
        user_id, raasi_sign, nakshatra, dasa, amsa_1, amsa_2, amsa_3,
        amsa_4, amsa_5, amsa_6, amsa_7, amsa_8, amsa_9, amsa_10, amsa_11, amsa_12,
        zodiac_sign, planetary_positions,
        rasi1, rasi2, rasi3, rasi4, rasi5, rasi6, rasi7, rasi8, rasi9, rasi10, rasi11, rasi12
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
    userId, raasiSign, nakshatra, dasa, amsa1, amsa2, amsa3,
    amsa4, amsa5, amsa6, amsa7, amsa8, amsa9, amsa10, amsa11, amsa12,
    zodiacSign, planetaryPositions,
    rasi1, rasi2, rasi3, rasi4, rasi5, rasi6, rasi7, rasi8, rasi9, rasi10, rasi11, rasi12
];

await db.query(query, values);
            

            // Insert into additional_details table
            await db.query(
                `INSERT INTO additional_details (
                    user_id, gothram, nativity, job, income, place_of_job, 
                    education_qualification, physical_status_details, other_details, 
                    mother_tongue, hobbies, annual_income
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.txtgothram,
                    data.txtnativity,
                    data.txtjob,
                    data.txtincome,
                    data.txtplaceofjob,
                    data.txtqualification,
                    data.physicalStatus,
                    data.txtotherdetails,
                    data.mother_tongue,
                    data.hobbies,
                    data.annual_income
                ]
            );

            // Insert into time_details table
            await db.query(
                `INSERT INTO time_details (
                    user_id, birth_date, years_lived, months_lived, days_lived, birthplace, 
                    current_age, time_since_registration
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.calendar1_container,  // Assuming calendar1_container holds birthdate
                    data.txtYears,
                    data.txtMonths,
                    data.txtDays,
                    data.txtplaceofbirth,
                    data.txtcurrentage,
                    data.txttime_since_registration
                ]
            );

            // Commit the transaction
            await db.commit();
            return res.status(200).json({ message: 'success' });
        } catch (error) {
            // Rollback the transaction on error
            await db.rollback();
            console.error('Transaction error:', error);
            //    return res.status(500).json( {error:'Error saving data'});
        }
    }

    // search data value =============================

    async search(data) {
        try {
            // Log received data for debugging
            console.log('Received data:', data);
    
            // Construct the SQL query with optional filters
            const query = `
                SELECT 
                    u.*, 
                    ad.*, 
                    fd.*, 
                    hd.*, 
                    p.*, 
                    td.*, 
                    up.* 
                FROM users u
                LEFT JOIN additional_details ad ON u.id = ad.user_id
                LEFT JOIN family_details fd ON u.id = fd.user_id
                LEFT JOIN horoscope_details hd ON u.id = hd.user_id
                LEFT JOIN preferences p ON u.id = p.user_id
                LEFT JOIN time_details td ON u.id = td.user_id
                LEFT JOIN uploads up ON u.id = up.user_id
                WHERE 
                    (u.gender LIKE ?)
                    AND (u.language LIKE ? OR u.language IS NULL)
                    AND (p.caste LIKE ? OR p.caste IS NULL)
                    AND (p.sub_caste LIKE ? OR p.sub_caste IS NULL)
                    AND (u.marital_status LIKE ? OR u.marital_status IS NULL)
                    AND (u.dob IS NOT NULL AND TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN ? AND ?)
            `;
    
            // Prepare the parameterized values, ensuring empty values are handled properly
            const values = [
                `%${data.DropDownList8 || ''}%`,        // Gender filter
                `%${data.Cntrl_DD_Religion || ''}%`,    // Religion filter
                `%${data.Cntrl_DD_Caste || ''}%`,       // Caste filter (empty string will be treated)
                `%${data.Cntrl_DD_SubCaste || ''}%`,    // Sub-caste filter (empty string will be treated)
                `%${data.Cntrl_DD_MaritalStatus || ''}%`, // Marital status filter
                data.Cntrl_DD_AgeFrom || 0,              // Age from
                data.Cntrl_DD_To || 100                  // Age to
            ];
    
            // Log the query and values for debugging
            console.log('Executing query:', mysql.format(query, values));
    
            // Execute the query using the promise-based API
            const [result] = await db.execute(query, values); // 'execute' method returns a Promise
    
            // Log the result to check if it's empty or contains data
            if (result.length === 0) {
                console.log('No results found');
            } else {
                console.log('Query executed successfully');
                console.log('Query result:', result);  // Check what data is returned
            }
    
            return result;  // Return the result
        } catch (error) {
            console.error('Unexpected error:', error.message);
            throw new Error('Unexpected error occurred: ' + error.message); // Reject if an unexpected error happens
        }
    }
    
    
    
    
    
    
    
    
   
    


}

module.exports = new userRegisterModel();
