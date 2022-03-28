import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default async (req, res) => {

    try {
        const contacts = (await db.collection('sections').doc('contacts').get()).data();

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            contacts
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
