import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";
import setFilePath from "~/helpers/upload/setFilePath";

export default defineEventHandler(async (event) => {

        try {

            const form = formidable();

            const {id} = await new Promise((resolve, reject) => {
                form.parse(event.req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {src, thumbnail} = (await db.collection('menu').doc(id).get()).data();

            await db.collection('menu').doc(id).delete();

            if (fs.existsSync(setFilePath('/public' + src))) {
                fs.unlinkSync(setFilePath('/public' + src));
            }

            if (fs.existsSync(setFilePath('/public' + thumbnail))) {
                fs.unlinkSync(setFilePath('/public' + thumbnail));
            }

           return  {
                id
            };

        } catch (e) {


            event.res.statusCode = 401;
            event.res.end(JSON.stringify({
                msg: 'Unauthenticated'
            }));
        }
})
