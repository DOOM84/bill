import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default async (req, res) => {

    try {
        const about = (await db.collection('sections').doc('about').get()).data();
        //const contacts = (await db.collection('sections').doc('contacts').get()).data();
        const info = (await db.collection('sections').doc('info').get()).data();

        const gallerySnap = await db.collection('gallery')
            .where('status', '==', true).select('image').get();

        const gallery = gallerySnap.docs.map((doc) => {
            return {...doc.data()};
        });

        const feedbackSnap = await db.collection('feedback')
            .where('status', '==', true).get();

        const feedback = feedbackSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        /*const menuSnap = await db.collection('menu')
            .where('status', '==', true).select('image', 'thumbnail').get();

        const menu = menuSnap.docs.map((doc) => {
            return {...doc.data()};
        });*/

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            about,
            //contacts,
            info,
            gallery,
            feedback,

            //menu
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
