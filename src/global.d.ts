declare global {
    var mongooseConn:{
        conn: Connection | null,
        promise:Promise<Connection> | null 
    }
}

export {}