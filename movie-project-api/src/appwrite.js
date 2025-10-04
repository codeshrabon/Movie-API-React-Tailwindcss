import { Client, Databases, ID, Query } from 'appwrite';


const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// we get appwrite access functionality 
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

    // here we write which functionality we use from appwrite 
    const database = new Databases(client);




// now time to implement function to track search by different user 
// searchTerm which movie they search and movie that associated with the searchterm 
// the fisrt movie that apeared after search 
export const updateSearchCount = async (searchTerm, movie) => {
    // 1. use appwrite sdk to check if the search term exists in the database 
    try{
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('searchTerm', searchTerm),
        ])

        // 2. if it does update the count 
        if(result.documents.length > 0){
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,{
                count: doc.count + 1,

            })
        }
        // 3. if it dosen't, create a new document with the search term and count as 1
        else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.$id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_url}`,
            })
        }
    } catch(error){
        console.error(error);
    }
    
    // for that we need to get access to appwrite function

    // we use this to see if we are getting those ids with our consol log 
    // console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);
    // console.log("PROJECT_ID:", PROJECT_ID);
    // console.log("DATABASE_ID:", DATABASE_ID);
    // console.log("COLLECTION_ID:", COLLECTION_ID);

}