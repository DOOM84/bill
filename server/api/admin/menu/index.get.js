import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const menuSnap = await db.collection('menu').get();

        const menu = menuSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            menu
        };



    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
