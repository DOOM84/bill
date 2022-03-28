import {
    getFirestore
} from "firebase-admin/firestore";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
//import * as yup from 'yup';

const db = getFirestore();

/*const schema = yup.object({

    updated: yup.object({

        hall: yup.string('Название зала должно быть строкой')
            .trim('Введите название зала').required('Введите название зала'),

        periods: yup.array().min(1).required('Ввдеите период(ы) времени')
    })
})*/

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/info/edit' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const updated = JSON.parse(data);

            /*await schema.validate({
                updated
            });*/

                const infoRef = db.collection('sections').doc('info');

                const updRes = await infoRef.set({halls: updated});

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                result: updated
            }));
        } catch (e) {

            if (e.path) {
                res.statusCode = 422;
                res.end(JSON.stringify({
                    msg: e.errors[0]
                }));

            } else {

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 401;
                res.end(JSON.stringify({msg: 'error_auth'}));

            }
        }
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
