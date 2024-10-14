conn = new Mongo();
db = conn.getDB("ideas");

db.createUser(
    {
        user: "mongodb",
        pwd: "mongodb",
        roles: [
            {
                role: "readWrite",
                db: "ideas"
            }
        ]
    }
);