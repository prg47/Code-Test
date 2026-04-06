import Session from "../models/Session.model.js";
import { streamClient,chatClient } from "../lib/stream.js";

export async function createSession(req,res){
    try {
        const {problem, problemId, difficulty} = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;
        
        if(!problem || !problemId || !difficulty){
            return res.status(400).json({msg: "problem, problemId or difficulty missing"});
        }
        
        //generate unique call id for stream-video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        //creating session in db
        const session = await Session.create({
            problem,
            problemId,
            difficulty,
            host:userId,
            callId
        });

        //creating stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id: clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()},
            },
        });

        //-----chat messaging
        const channel = chatClient.channel("messaging",callId,{
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        });

        await channel.create();
        res.status(201).json({session});

    } catch (error) {
        console.log("Error in creating Session", error);
        res.status(500).json({msg:"Internal Server Error"});
    }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req,res){
    try {
        const userId = req.user._id;
        //sessions where user is either host or participant
        const sessions = await Session.find({
            status: "completed",
            $or: [{host:userId},{participant:userId}]
        }).sort({createdAt:-1}).limit(10);

        res.status(200).json({sessions});

    } catch (error) {
        console.log("Error getting recent sessions");
        res.status(500).json({msg: "Internal Server error"});
    }
}

export async function getSessionById(req,res){
    try {
        const {id} = req.params;

        const session = await Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","host email profileImage clerkId")

        if(!session) return res.status(404).json({msg: "session not found"});

        res.status(200).json({session});
        
    } catch (error) {
        console.log("Error getting  sessions by id");
        res.status(500).json({msg: "Internal Server error"});
    }
}

export async function joinSession(req,res){
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if(!session) res.status(404).json({msg: "session not found"});

        if (session.status !== "active") {
            return res.status(400).json({ message: "Cannot join a completed session" });
        }

        if (session.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "Host cannot join their own session as participant" });
        }

        //checking if session is already full
        if(session.participant) return res.status(409).json({msg:"session full"});

        session.participant = userId;
        await session.save();

        const channel = chatClient.channel("messaging",session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session});

    } catch (error) {
        console.log("Error joining session");
        res.status(500).json({msg: "Internal Server error"});
    }
}

export async function endSession(req,res){
    try {
        const {id} = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if(!session) return res.status(404).json({msg : "session not found"});

        //check if user is host
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({msg : "Only host can end the session"});
        }

        //if session is already completed
        if(session.status === "completed"){
            return res.status(400).json({msg : "Session already completed"});
        }

        //delete video call and message
        const call = streamClient.video.call("default",session.callId);
        await call.delete({hard: true});

        const channel = chatClient.channel("messaging",session.callId);
        await channel.delete();

        session.status = "completed";
        await session.save();

        res.status(200).json({msg: "session ended succesfully"});

    } catch (error) {
        console.log("Error getting  sessions by id");
        res.status(500).json({msg: "Internal Server error"});
    }
    
}