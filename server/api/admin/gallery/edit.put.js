import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
//import sharp from 'sharp';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();

//import getRandom from "~/helpers/getRandom";
//import fs from "fs";

export default defineEventHandler(async (event) => {

       // const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            //maxFileSize: 20 * 1024 * 1024,
            //multiples: true,
        });

        //const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        //const maxFileSize = 2000000;

        const {fields, err} = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

            try {

                await db.collection('gallery').doc(added.id).update(added);

                return {result: added};

            } catch (e) {

                if (e.path) {
                    event.res.statusCode = 422;
                    event.res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));

                } else {

                    event.res.setHeader('Content-Type', 'application/json');
                    event.res.statusCode = 401;
                    event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }
})

