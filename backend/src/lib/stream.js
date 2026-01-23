import {StreamChat} from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk";
import {ENV} from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream Api Key or Secret is missing");
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret); //chat client
export const streamClient = new StreamClient(apiKey,apiSecret); // video call features

export const upsertStreamUser = async(userData)=>{
    try{
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully");
    }catch(error){
        console.error("Error upserting Stream User: ",error);
    }
}

export const deleteStreamUser = async(userId)=>{
    try{
        await chatClient.deleteUser(userId);
        console.log("Stream User Deleted Succesfully : ", userId);
    }catch(error){
        console.error("Error deleting Stream User: ",error);
    }
}