package com.eazy.chat.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.eazy.chat.model.message;

@Controller
public class chatController {
	//HashMap<String,ArrayList<String>> regUsers= new HashMap<String,ArrayList<String>>();
	ArrayList<message> regUsers= new ArrayList<message>();
	@Autowired
	private SimpMessagingTemplate smt;
	
	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	public message receivePublicMessage(@Payload message msg) {		
		if(msg.getStatus().toString().equals("JOIN")) {
			regUsers.add(msg);
			
			for(int i=0;i<regUsers.size();i++) {
				smt.convertAndSendToUser(msg.getSenderName(),"/private", regUsers.get(i));
			}
		}		
		return msg;
	}
	
	@MessageMapping("/private-message")
	public void receivePrivateMessage(@Payload message msg) {
		System.out.println(msg);
		smt.convertAndSendToUser(msg.getReceiverName(),"/private", msg);
		return;
	}

}
