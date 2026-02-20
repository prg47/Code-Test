import {useQuery, useMutation} from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/sessions"

export const useCreateSession = ()=>{
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.createSession,
        onSuccess: ()=> toast.success("session created successfully"),
        onError: (error)=> toast.error(error.response?.data?.message || "error creating session")
    });

    return result;
}

export const useActiveSessions = ()=>{
    const result = useQuery({
        queryKey:["activeSessions"],
        queryFn: ()=>sessionApi.getActiveSessions(),
    });

    return result;
}

export const useMyRecentSessions = ()=>{
    const result = useQuery({
        queryKey:["myRecentSessions"],
        queryFn: ()=>sessionApi.getMyRecentSessions(),
    });

    return result;
}

export const useSessionById = (id)=>{
    const result = useQuery({
        queryKey:["session",id],
        queryFn: ()=>sessionApi.getSessionById(id),
        enabled: !!id, //convert to boolean
        refetchInterval: 5000
    });

    return result;
}

export const useJoinSession = ()=>{
    return useMutation({
        mutationKey: ["joinSession"],
        mutationFn: sessionApi.joinSession,
        onSuccess: ()=>toast.success("joined successfully"),
        onError: (error)=> toast.error(error.response?.data?.message || "error joining session")
    })
}

export const useEndSession = ()=>{
    return useMutation({
        mutationKey: ["endSession"],
        mutationFn: sessionApi.endSession,
        onSuccess: ()=>toast.success("session ended successfully"),
        onError: (error)=> toast.error(error.response?.data?.message || "error ending session")
    })
}