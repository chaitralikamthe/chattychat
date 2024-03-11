package com.eazy.chat.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eazy.chat.model.message;
import com.eazy.chat.repos.messageRepo;

@Service
public class messageService {
	

		@Autowired
		private messageRepo msgRepo;

		public void saveMessage(message msg) {
			msgRepo.save(msg);
		}
		
		public ArrayList<message> RegLoadHistory(message msg) {			ArrayList<message> msgs= msgRepo.findBySenderNameOrReceiverNameOrderByCreatedAtAsc(msg.getSenderName().toString(),msg.getSenderName().toString());
			ArrayList<message> chatroomMsgs= msgRepo.findBySenderNameOrReceiverNameOrderByCreatedAtAsc("Chatroom","Chatroom");
			msgs.addAll(chatroomMsgs);
			return msgs;

		}
		
}
