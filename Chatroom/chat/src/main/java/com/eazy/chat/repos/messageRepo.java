package com.eazy.chat.repos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eazy.chat.model.message;

@Repository
public interface messageRepo extends JpaRepository<message,Integer> {
	ArrayList<message>findBySenderNameOrReceiverNameOrderByCreatedAtAsc(String senderName,String receiverName);
}
