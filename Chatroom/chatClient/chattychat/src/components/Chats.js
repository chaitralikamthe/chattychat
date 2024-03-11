import React, { useState,useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { connect } from 'net';


var stompClient=null;
const Chats = () => {
    const location= useLocation();
    const [publicChats,setPublicChats]=useState([]);
    const [privateChats,setPrivateChats]= useState(new Map());
    const [tab,setTab]=useState("CHATROOM");
    const [userdata,setuserdata]=useState({
        userName : location.state.userName,
        receiverName:"",
        connected:false,
        message:"",
})
const connect=()=>{
let Sock= new SockJS('http://localhost:8081/ws');       
stompClient=over(Sock);  
stompClient.connect({},()=>{onConnected()},onError);   
}

    const onConnected=()=>{
        setuserdata({...userdata,"connected":true});
        stompClient.subscribe('/chatroom/public',onPublicMessageReceived);          
        stompClient.subscribe('/user/'+userdata.userName+'/private',onPrivateMessageReceived); 
        userJoin();
    }

    const onError = (err) => {
        console.log(err);        
    }
                               


    const userJoin=()=>{
        const chatMessage={
                senderName:userdata.userName,
                statuss:'REGISTERED'
                };
            stompClient.send('/app/message',{},JSON.stringify(chatMessage));                 //check
        }

        const onPublicMessageReceived=(payload)=>{
        var payloadData=JSON.parse(payload.body);
        switch(payloadData.statuss){
            case "REGISTERED" :{
                if(!privateChats.get(payloadData.senderName)){
                privateChats.set(payloadData.senderName,[]);
                setPrivateChats(new Map(privateChats));
                   }
                   break; 
                }
            case "MESSAGE" :
            {
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            }
        }
    }

    const onPrivateMessageReceived=(payload)=>{
        console.log("check here"+payload);
        var payloadData=JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }
        else{
            let list=[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const sendPublicMessage=()=>{
    if(stompClient){
            const chatMessage={
                senderName: userdata.userName,
                receiverName: "Chatroom",
                message: userdata.message,
                statuss:'MESSAGE'
                };
            stompClient.send('/app/message',{},JSON.stringify(chatMessage));
            setuserdata({...userdata,"message":""});
        }
    }

    const sendPrivateMessage=()=>{
        if(stompClient){
            const chatMessage= {
                senderName: userdata.userName,
                receiverName: tab,
                message: userdata.message,
                statuss:'MESSAGE'
                };
            if(userdata.userName !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message',{},JSON.stringify(chatMessage));
            setuserdata({...userdata,"message":""});
        }
    }
    const handleMessage=(event)=>{
        const {value}=event.target;
        setuserdata({...userdata,"message": value});
    }   

  return (
    <div className='container'>
        {userdata.connected== false ?
        <div><button id="start" onClick={connect}>Start</button></div>
        :
        <div className='chat-box'>
            <div className='member-list'>
            <h1 className='joiner'>{userdata.userName}'s Chatbox</h1>
                <ul>
                    <li onClick={()=>setTab("CHATROOM")} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>
                            {name}
                        </li>
                    ))
                    }
                </ul>
            </div>
           {tab==="CHATROOM" && <div className='chat-content'>
                <ul className='chat-messages'>
                {publicChats.map((chat,index)=>(
                <>{(chat.history == "true") ? <li className='self' key='index'>
                    <div className='avatar self'>{chat.message}</div>
                    </li>
                    :        
                    <>{(chat.senderName !== userdata.userName) ?
                        <li className='other' key='index'>
                        <div className='avatar'>{chat.message}</div>
                        </li>
                        :
                        <li className='self' key='index'>
                        <div className='avatar self'>{chat.message}</div>
                        </li>
                     }</>
                    }</>
                ))}
                </ul>

                <div className='send-message'>
                    <input type='text' className='input-message'  placeholder='Enter public message' 
                    value={userdata.message} onChange={handleMessage}/>
                    <button type='button' className='send-button'  onClick={sendPublicMessage}>Send</button>
                </div>
            </div>
         }  

         {tab!=="CHATROOM" && <div className='chat-content'>
            <ul className='chat-messages'>
                {privateChats.get(tab).map((chat,index)=>(
                <>{(chat.history == "true") ? <li className='self' key='index'>
                <div className='avatar self'>{chat.message}</div>
                </li>
                :        
                <>{(chat.senderName !== userdata.userName) ?
                    <li className='other' key='index'>
                    <div className='avatar'>{chat.message}</div>
                    </li>
                    :
                    <li className='self' key='index'>
                    <div className='avatar self'>{chat.message}</div>
                    </li>
                 }</>
                }</>
                ))}
            </ul>
            
            <div className='send-message'>
                    <input className='input-message' type='text' placeholder={`Enter private message for ${tab}` }
                    value={userdata.message} onChange={handleMessage}/>
                    <button className='send-button' type='button' onClick={sendPrivateMessage}>Send</button>
                </div>
            </div>

         }</div>  
        }    
   </div>
                       
)

}
export default Chats;
