import React, { useState,useEffect } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient=null;
const Chatroom = () => {
    const [publicChats,setPublicChats]=useState([]);
    const [tab,setTab]=useState("CHATROOM");
    const [userdata,setuserdata]=useState({
        userName :"",
        receiverName:"Chatroom",
        connected:false,
        message:"",
    })

    useEffect(() => {
        console.log(userdata);
      }, [userdata]);

    const handleUsername=(event)=>{
        const {value}=event.target;
        setuserdata({...userdata,"userName": value});
    }
    const handleMessage=(event)=>{
        const {value}=event.target;
        setuserdata({...userdata,"message": value});
    }

        const connect=(flag)=>{
        let Sock= new SockJS('http://localhost:8081/ws');       //check
        stompClient=over(Sock);                                 //check
        stompClient.connect({},()=>{onConnected(flag)},onError);            //check
    }

    const onConnected=(flag)=>{
        setuserdata({...userdata,"connected":true});
        stompClient.subscribe('/chatroom/public',onPublicMessageReceived);          //check
       // stompClient.subscribe('/user/'+userdata.userName+'/private',onPrivateMessageReceived); //check
        userJoin(flag);
    }

    const onError = (err) => {
        console.log(err);        
    }

    const userJoin=(flag)=>{
    const chatMessage={
                senderName:userdata.userName,
                statuss:'NONREGISTERED'
                };
            stompClient.send('/app/message',{},JSON.stringify(chatMessage));                 //check
        }        


    const onPublicMessageReceived=(payload)=>{
        var payloadData=JSON.parse(payload.body);
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);

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

  return (
    <div className='container'>
        <div className='chat-box'>
            <div className='member-list'>
            <h1 className='joiner'>{userdata.userName}'s Chatbox</h1>
                <ul>
                    <li onClick={()=>setTab("CHATROOM")} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
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
        </div>      
   </div>
                   
)

}
export default Chatroom;
