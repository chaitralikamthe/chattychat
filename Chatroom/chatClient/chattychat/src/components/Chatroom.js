import React, { useState,useEffect } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';


var stompClient=null;
const Chatroom = () => {
    const [publicChats,setPublicChats]=useState([]);
    const [privateChats,setPrivateChats]= useState(new Map());
    const [tab,setTab]=useState("CHATROOM");
    const [userdata,setuserdata]=useState({
        userName :"",
        receiverName:"",
        connected:false,
        message:""
    })

    useEffect(() => {
        console.log(userdata);
      }, [userdata]);

    const handleUsername=(event)=>{
        const {value}=event.target;
        setuserdata({...userdata,"userName": value});
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setuserdata({...userdata,"message": value});
    }

    const connect=()=>{
        let Sock= new SockJS('http://localhost:8080/ws');       //check
        stompClient=over(Sock);                                 //check
        stompClient.connect({},onConnected,onError);            //check
    }

    const onConnected=()=>{
        setuserdata({...userdata,"connected":true});
        stompClient.subscribe('/chatroom/public',onPublicMessageReceived);          //check
        stompClient.subscribe('/user/'+userdata.userName+'/private',onPrivateMessageReceived); //check
        userJoin();
    }

    const onError = (err) => {
        console.log(err);        
    }

    const registerUser=()=>{
        connect();
    }

    const userJoin=()=>{
        const chatMessage={
                senderName:userdata.userName,
                status:'JOIN'
                };
            stompClient.send('/app/message',{},JSON.stringify(chatMessage));        //check
     }

    const onPublicMessageReceived=(payload)=>{
        var payloadData=JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN" :{
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
                message: userdata.message,
                status:'MESSAGE'
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
                status:'MESSAGE'
                };
            if(userdata.userName !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/private-message',{},JSON.stringify(chatMessage));
            setuserdata({...userdata,"message":""});
        }
    }

  return (
    <div className='container'>
        {userdata.connected ?
        <div className='chat=box'>
            <div className='member-list'>
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
                <li className={`message ${chat.senderName === userdata.userName && "self"}`} key='index'>
                    {chat.senderName !== userdata.userName &&
                    <div className='avatar' >{chat.senderName}</div>}

                    <div className='message-data'>{chat.message}</div>
                    {chat.senderName === userdata.userName &&
                    <div className='avatar self' >{chat.senderName}</div>}
               </li>
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
                <li className='message' key='index'>
                    {chat.senderName !== userdata.userName &&
                    <div className='avatar' >{chat.senderName}</div>}
                    <div className='message-data'>{chat.message}</div>
                    {chat.senderName === userdata.userName &&
                    <div className='avatar self' >{chat.senderName}</div>}
               </li>
                ))}
            </ul>
            
            <div className='send-message'>
                    <input className='input-message' type='text' placeholder={`Enter private message for ${tab}` }
                    value={userdata.message} onChange={handleMessage}/>
                    <button className='send-button' type='button' onClick={sendPrivateMessage}>Send</button>
                </div>
            </div>

         }</div>

        :
        <div className='register'>
            <input
            id='user-name'
            placeholder='Enter the username'
            value={userdata.userName}
            onChange={handleUsername}
            margin="normal"
            />

            <button type='button' onClick={registerUser}>
                Connect
            </button> 
                 
        </div>
}
    </div>                
)

}
export default Chatroom;
