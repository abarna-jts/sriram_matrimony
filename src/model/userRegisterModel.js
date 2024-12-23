const db = require('../../config/db_config');
const mysql = require('mysql2');  // Import the mysql2 package
const bcrypt = require('bcryptjs');

class userRegisterModel {
    async user_data_post(data, files, res) {
        console.log(data);

        try {
            // Start the transaction
            await db.beginTransaction();
            const hasedpassword = await bcrypt.hash(data.txtpsword, 10)

            // Insert into users table
            const [userResult] = await db.query(
                `INSERT INTO users (
        name, gender, marital_status, dob,blood_group, mobile_no,email, password, present_address, permanent_address,
       contact_person, height, weight, language, disablity, complexion, profile_picture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    data.physicalStatus,
                    data.complexion,
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
                    m_elder_brothers,m_elder_sisters,m_younger_brothers,m_younger_sisters,any_other_details
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
                    data.ddlunelderbrother,
                    data.ddluneldersister,
                    data.ddlunyoungerbrother,
                    data.ddlunyoungersister,
                    data.txtotherdetails,
                ]
            );

            // Insert into preferences table
            await db.query(
                `INSERT INTO preferences (
                    user_id, diet, qualification, ex_job, job_status,  complexion, preferred_age_from, preferred_age_to, 
                    preferred_height, education_status, religion, caste, income_range,
                    diet_vg, diet_non_vg, diet_egg, diet_not_matter, horoscope_required, m_s_mr, m_s_unmr, m_s_wd_wdr, m_s_div, m_s_not_matter
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    // 13 column's
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
                    data.txtincome1,
                    // dieat column's 5
                    data.chkvegetarian,
                    data.chknonveg,
                    data.chkeggetarian,
                    data.chkdoes,
                    data.Acceptable,
                    // married status 5 column's
                    data.chkUnmarried,
                    data.chkmarried,
                    data.chkWidow,
                    data.chkDivorced,
                    data.chkdoesntmatter,
                    // total column's 22---
                ]
            );
            console.log(data.raasiSign,);

            // Insert into horoscope_details table

            await db.query(
                `INSERT INTO horoscope_details (
                    user_id, cast, sub_cast, raasi_sign, nakshatra, dasa,
                    amsa_1, amsa_2, amsa_3, amsa_4, amsa_5, amsa_6, amsa_7,amsa_8, amsa_9, amsa_10, amsa_11, amsa_12,
                     zodiac_sign, planetary_positions,
                    rasi1, rasi2, rasi3, rasi4, rasi5, rasi6, rasi7, rasi8, rasi9, rasi10, rasi11, rasi12, phadam, laknam
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.ddlcaste,
                    data.ddlsubcaste,
                    data.ddlRaasiSign,
                    data.ddlStar,
                    data.txtDasa,
                    data.txtAmsam1,
                    data.txtAmsam2,
                    data.txtAmsam3,
                    data.txtAmsam4,
                    data.txtAmsam5,
                    data.txtAmsam6,
                    data.txtAmsam7,
                    data.txtAmsam8,
                    data.txtAmsam9,
                    data.txtAmsam10,
                    data.txtAmsam11,
                    data.txtAmsam12,
                    data.zodiac_sign,
                    data.planetary_positions,
                    data.txtHoro1,
                    data.txtHoro2,
                    data.txtHoro3,
                    data.txtHoro4,
                    data.txtHoro5,
                    data.txtHoro6,
                    data.txtHoro7,
                    data.txtHoro8,
                    data.txtHoro9,
                    data.txtHoro10,
                    data.txtHoro11,
                    data.txtHoro12,
                    data.ddlLaknamNO,
                    data.ddlLaknam,
                ]
            );
            // Insert into additional_details table
            await db.query(
                `INSERT INTO additional_details (
                    user_id, gothram, nativity, job, income, place_of_job, 
                    education_qualification, physical_status_details, other_details, 
                    mother_tongue
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                ]
            );

            // Insert into time_details table
            await db.query(
                `INSERT INTO time_details (
                    user_id, birth_date, years_lived, months_lived, days_lived, birthplace, 
                    current_age, time_since_registration,hors_py,minutes_py,am_pm
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.calendar1_container,  // Assuming calendar1_container holds birthdate
                    data.txtYears,
                    data.txtMonths,
                    data.txtDays,
                    data.txtplaceofbirth,
                    data.txtcurrentage,
                    data.txttime_since_registration,
                    data.DropDownList6,
                    data.DropDownList7,
                    data.DropDownList8,
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
