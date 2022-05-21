import {
    getFirestore
} from "firebase-admin/firestore";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';

const db = getFirestore();

export default defineEventHandler(async (event) => {

        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(event.req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const updated = JSON.parse(data);

            /*await schema.validate({
                updated
            });*/

                const infoRef = db.collection('sections').doc('info');

                await infoRef.set({halls: updated});

            return {
                result: updated
            };
        } catch (e) {

            if (e.path) {
                event.res.statusCode = 422;
                event.res.end(JSON.stringify({
                    msg: e.errors[0]
                }));

            } else {

                event.res.setHeader('Content-Type', 'application/json');
                event.res.statusCode = 401;
                event.res.end(JSON.stringify({msg: 'error_auth'}));

            }
        }
})
