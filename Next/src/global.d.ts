import { Connection } from "mongoose";

declare global{
    var mongooseConn:{
        conn:Connetion | null,
        promise:Promise<Connection> | null
    }
}

export {}