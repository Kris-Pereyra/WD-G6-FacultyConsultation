'use strict';
const fs=require('fs'),path=require('path');
async function main(){
 require('dotenv').config({path:path.join(__dirname,'.env')});
 const {Pool}=require('pg');
 const pool=new Pool({user:process.env.DB_USER,host:process.env.DB_HOST,database:process.env.DB_NAME,password:process.env.DB_PASSWORD,port:Number(process.env.DB_PORT)||5432});
 try{await pool.query(fs.readFileSync(path.join(__dirname,'faculty-auth.sql'),'utf8'));console.log('Faculty login tables and student roles are ready. Existing records were retained.');}
 catch(error){console.error('Setup failed:',error.message);process.exitCode=1;}
 finally{await pool.end()}
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
