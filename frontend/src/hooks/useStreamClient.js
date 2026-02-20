import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";


function useStreamClient(session, loadingSession, isHost, isParticipant){
   const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true); 

  useEffect(()=>{
    let videoCall = null;
    let chatClientInstance = null;
    let cancelled = false;

    const initCall = async()=>{
        if(!session?.callId || (!isHost && !isParticipant)) {
            setIsInitializingCall(false);
           return;
       }

        try {
            const {token,userId,userName,userImage} = await sessionApi.getStreamToken()
             if (cancelled) return;
            const client = await initializeStreamClient({
                id: userId,
                name: userName,
                image: userImage

            },
            token
        )
        
        if (cancelled) return;
        setStreamClient(client)
        
        videoCall = client.call("default",session.callId)
        await videoCall.join({create:true});
        if (cancelled) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey)

        await chatClientInstance.connectUser({
            id: userId,
                name: userName,
                image: userImage
        },
        token
    )
    if (cancelled) return;
        
    setChatClient(chatClientInstance);

    const chatChannel = chatClientInstance.channel("messaging",session.callId)
    await chatChannel.watch();
    if (cancelled) return;

    setChannel(chatChannel);

        } catch (error) {
            toast.error("Failed to join video call")
            console.error("Error init call",error)
        } finally{
            setIsInitializingCall(false)
        }
    }

     if (session?.callId && !loadingSession && (isHost || isParticipant)) initCall();


    //cleanup
    return ()=>{
        //iife
        cancelled = true;
        (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    }
    }, [session?.callId, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall

  }
}



export default useStreamClient;