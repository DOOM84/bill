import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import * as yup from "yup";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import uploadFile from "~/helpers/upload/uploadFile";

const schema = yup.object({

    added: yup.object({
        name: yup.string('Имя должно быть строкой')
            .trim('Введите имя').required('Введите имя'),
    })
})

export default defineEventHandler(async (event) => {

       // const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 20 * 1024 * 1024,
            //multiples: true,
        });

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        //const maxFileSize = 2000000;

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        const added = JSON.parse(fields.data);

        if (err || (files.file && !allowedTypes.includes(files.file.mimetype))/*|| files.avatar.size > maxFileSize*/) {
            event.res.statusCode = 422;
            event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
        } else {

            try {

                await schema.validate({
                    added,
                });

                const picPath = prepareFileInfo(files.file.newFilename, '/public/img/feedback/');

                const {mainImage} = await uploadFile(files.file, '/public/', {
                    mainImage: true,
                    mainImagePath: picPath,
                    mainImageWidth: null,
                    mainImageHeight: null,
                });

                added.image = mainImage.substring(mainImage.indexOf('/img'));

                const { id } = await db.collection('feedback').add(added);

                added.id = id;

               return  {result: added};

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
        }
})