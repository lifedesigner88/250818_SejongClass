import db from "#app/db/index.js";




export async function getCommentsToAdmin() {
    return db.query.commentsTable.findMany({})

}