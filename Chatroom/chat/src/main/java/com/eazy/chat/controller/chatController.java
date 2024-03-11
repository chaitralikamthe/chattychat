package com.eazy.chat.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.eazy.chat.model.message;
import com.eazy.chat.model.users;
import com.eazy.chat.service.messageService;
import com.eazy.chat.service.userService;

@Controller
public class chatController {
	

	private messageService msgService;

	@Autowired
	public chatController(messageService msgService) {
		this.msgService=msgService;
	}	

	@Autowired
	private SimpMessagingTemplate smt;
		
	@CrossOrigin(origins="*")
	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	public message receivePublicMessage(@Payload message msg) {
	//	if(msg.getStatuss().toString().equals("MESSAGE"))		
		if(msg.getStatuss()!=null && msg.getStatuss().equals("REGISTERED")) {
			msgService.saveMessage(msg);
			ArrayList<message> regUsers= new ArrayList<message>(msgService.RegLoadHistory(msg));
			for (message regUser : regUsers) {
//				if(regUser.getStatuss().equals("MESSAGE")) {	
//					if(regUser.getReceiverName().equals("Chatroom")){
//						regUser.setReceiverName(regUser.getSenderName());
//						regUser.setSenderName("Chatroom");
//						regUser.setHistory("true");
//						smt.convertAndSendToUser(msg.getSenderName(),"/public", regUser);						
//					}
					if(msg.getSenderName().toString().equals(regUser.getSenderName().toString())) {				
					regUser.setSenderName(regUser.getReceiverName());
					regUser.setHistory("true");
					System.out.println(regUser);
					smt.convertAndSendToUser(msg.getSenderName(),"/private", regUser);
					}
					else {						
						smt.convertAndSendToUser(msg.getSenderName(),"/private", regUser);
					}}}
			
		return msg;
	}
	
	@CrossOrigin(origins="*")
	@MessageMapping("/private-message")
	public void receivePrivateMessage(@Payload message msg) {
		msgService.saveMessage(msg);
		System.out.println(msg);
		smt.convertAndSendToUser(msg.getReceiverName(),"/private", msg);
		return;
	}

}
