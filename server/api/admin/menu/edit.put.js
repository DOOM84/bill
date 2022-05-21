import formidable from "formidable";
import {firstValues} from 'formidable/src/helpers/firstValues.js';
//import sharp from 'sharp';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();

import getRandom from "~/helpers/getRandom";
import fs from "fs";
import setFilePath from "~/helpers/upload/setFilePath";
import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import uploadFile from "~/helpers/upload/uploadFile";

export default defineEventHandler(async (event) => {

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

                if (files.file) {

                    if (fs.existsSync(setFilePath('/public' + added.src))) {
                        fs.unlinkSync(setFilePath('/public' + added.src));
                    }
                    if (fs.existsSync(setFilePath('/public' + added.thumbnail))) {
                        fs.unlinkSync(setFilePath('/public' + added.thumbnail));
                    }

                    const picPath = prepareFileInfo(files.file.newFilename, '/public/img/menu/original/');

                    const {mainImage, thumbnail} = await uploadFile(files.file, '/public/', {
                        mainImage: true,
                        mainImagePath: picPath,
                        mainImageWidth: null,
                        mainImageHeight: null,
                        thumbnail: true,
                        thumbnailPath: prepareFileInfo(files.file,
                            '/public/img/menu/thumbnail/',
                            picPath.substring(picPath.lastIndexOf('/') + 1)),
                        thumbnailWidth: 300,
                        thumbnailHeight: 500
                    });

                    added.src = mainImage.substring(mainImage.indexOf('/img'));

                    added.thumbnail = thumbnail.substring(thumbnail.indexOf('/img'));

                }

                    await db.collection('menu').doc(added.id).update({...added});


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

async function uploadImg(file, added) {

    let uploadPath = file.filepath;
    let fileName = file.newFilename;
    let ext = fileName.substring(fileName.indexOf('.') + 1);

    let nameWithSalt = Date.now() + getRandom(10000000, 1) + (+new Date).toString(36).slice(-5);

    let newPath = 'public/img/menu/original/' + nameWithSalt + '.' + ext;
    let thumbnailPath = 'public/img/menu/thumbnail/' + nameWithSalt + '.' + ext;

    added.src = newPath.substring(6);
    added.thumbnail = thumbnailPath.substring(6);

    await db.collection('menu').doc(added.id).update({...added, w: 849, h: 1416});

    await sharp(uploadPath)//.resize({height: 100, width: 300, fit: 'outside'})
        .toFile(newPath)
    await sharp(uploadPath).resize({height: 500, width: 300, fit: 'outside'})
        .toFile(thumbnailPath)

    //await Promise.all([await aaa(uploadPath, newPath), await bbb(uploadPath, thumbnailPath)]);
}

