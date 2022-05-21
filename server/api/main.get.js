import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {
        const about = (await db.collection('sections').doc('about').get()).data();

        const info = (await db.collection('sections').doc('info').get()).data();

        const gallerySnap = await db.collection('gallery')
            .where('status', '==', true).select('src', 'thumb').get();

        const gallery = gallerySnap.docs.map((doc) => {
            return {...doc.data()};
        });

        const feedbackSnap = await db.collection('feedback')
            .where('status', '==', true).get();

        const feedback = feedbackSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        return {
            about,
            info,
            gallery,
            feedback,
        };

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
