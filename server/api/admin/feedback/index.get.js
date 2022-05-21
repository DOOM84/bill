import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const feedbackSnap = await db.collection('feedback').get();

        const feedback = feedbackSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            feedback,
        };



    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
