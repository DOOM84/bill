import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {
        const contacts = (await db.collection('sections').doc('contacts').get()).data();

        return {
            contacts
        };

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
