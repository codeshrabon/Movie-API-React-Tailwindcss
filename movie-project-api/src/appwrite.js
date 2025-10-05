import { Client, Databases, ID, Query, TablesDB } from 'appwrite';


const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// we get appwrite access functionality 
// connecting with appwrite and my project 
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)
    ;

    // to access any of the appwrite services 
   /*  const account = new Account(client);

    // register user 
    account.create(ID.unique(),"iamfaysal@gmail.com", "appwrite", "faysal")
        .then(function (response){
            console.log(response);
        }, function (error){
            console.log(error);
        }); */


    // here we write which functionality we use from appwrite 
    //const database = new Databases(client);
    // since database is deprecated we use table instead 
    const table = new TablesDB(client);



// this function is to track search 
// now time to implement function to track search by different user 
// searchTerm which movie they search and movie that associated with the searchterm 
// the fisrt movie that apeared after search 
export const updateSearchCount = async (searchTerm, movie) => {
    // 1. use appwrite sdk to check if the search term exists in the database 
    try{
        const result = await table.listRows({
          databaseId: DATABASE_ID,
          tableId: COLLECTION_ID,
          queries: [Query.equal('searchTerm', searchTerm)]
          });

          // ✅ Updated listDocuments syntax
        /* const result = await table.listRows({
            databaseId: DATABASE_ID,
            collectionId: COLLECTION_ID,
            queries: [Query.equal('searchTerm', searchTerm)],
    }); */

        // 2. if it does update the count 
        if(result.rows.length > 0){
            const row = result.rows[0];

            await table.updateRow({
              databaseId: DATABASE_ID, 
              tableId: COLLECTION_ID, 
              rowId: row.$id,
              data:{
                count: row.count + 1,},
              })

           // ✅ Update existing row
      /* await table.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      }); */
        }
        // 3. if it dosen't, create a new document with the search term and count as 1
        //poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        //There is no property called poster_url in TMDB data — only poster_path.
        else{
            await table.createRow({
              databaseId: DATABASE_ID, 
              tableId: COLLECTION_ID, 
              rowId: ID.unique(), 
              data: {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            },
          });

            // ✅ Create new row
      /* await table.createRow({
        database_Id: DATABASE_ID,
        table_Id: COLLECTION_ID,
        row_Id: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.$id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      }); */
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

// here we build to get trending movies 
export const getTrendingMovies = async () =>{
  try{
    const result = await table.listRows({
      databaseId:DATABASE_ID,
      tableId:COLLECTION_ID,
      queries:[Query.limit(5),
        Query.orderDesc("count"),
      ],
    });
    //console.log(`Trending: ${result}`);
    return result.rows;
  }
  catch(error){
    console.error(error);
    return [];
  }
}