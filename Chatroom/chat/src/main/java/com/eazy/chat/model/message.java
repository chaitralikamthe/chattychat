package com.eazy.chat.model;

import lombok.Data;

@Data
public class message {
	private String senderName;
	private String receiverName;
	private String message;
	private String Date;
	private Status status;

}
