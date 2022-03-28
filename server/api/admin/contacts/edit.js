import {
    getFirestore
} from "firebase-admin/firestore";
import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import * as yup from 'yup';

const db = getFirestore();

const schema = yup.object({

    updated: yup.object({

        address: yup.string('Адрес должен быть строкой')
            .trim('Введите адрес').required('Введите адрес'),
        time: yup.string('Время должно быть строкой')
            .trim('Введите время работы').required('Введите время работы'),
        phone: yup.string('Телефон должен быть строкой')
            .trim('Введите номер телефона').required('Введите номер телефона'),
    })
})

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/contacts/edit' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const updated = JSON.parse(data);

            await schema.validate({
                updated
            });

            if (updated) {

                const contactsRef = db.collection('sections').doc('contacts');

                const updRes = await contactsRef.set(updated);
            }

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