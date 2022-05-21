import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {
        const menuSnap = await db.collection('menu')
            .where('status', '==', true).get();

        const menu = menuSnap.docs.map((doc) => {
            return {...doc.data()};
        });

       return  {
            menu
        };

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
