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

export default defineEventHandler(async (event) => {

        try {

            const form = formidable();

            const {data} = await new Promise((resolve, reject) => {
                form.parse(event.req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const updated = JSON.parse(data);

            await schema.validate({
                updated
            });

            if (updated) {

                const contactsRef = db.collection('sections').doc('contacts');

                await contactsRef.set(updated);
            }

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
                event.res.end(JSON.stringify({msg: 'Unauthenticated'}));

            }
        }
})
