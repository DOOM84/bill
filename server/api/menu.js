import { getFirestore} from 'firebase-admin/firestore';

/*
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import * as serviceAccount from "../../helpers/bill-2648a-firebase-adminsdk-nhlmk-b2113d9718.json";

const apps = getApps();

if (!apps.length) {
    initializeApp({
        credential: cert(serviceAccount)
    })
}
*/


const db = getFirestore();


export default async (req, res) => {

    try {
        const menuSnap = await db.collection('menu')
            .where('status', '==', true).get();

        const menu = menuSnap.docs.map((doc) => {
            return {...doc.data()};
        });

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            menu
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
